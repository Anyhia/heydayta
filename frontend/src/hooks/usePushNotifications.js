import { useEffect, useState, useCallback } from 'react';
import api from '../api';
import * as Sentry from '@sentry/browser';

export const PUSH_PREF_KEY = 'heydayta_push_enabled';

// The browser's PushManager.subscribe() requires the VAPID public key as a Uint8Array,
// but the server sends it as a Base64URL string (a web-safe variant of Base64 that uses
// '-' instead of '+' and '_' instead of '/', with no padding).
// This function converts it back to the binary format the browser expects by:
// 1. Re-adding the '=' padding that Base64URL strips out
// 2. Swapping '-' → '+' and '_' → '/' to turn it back into standard Base64
// 3. Decoding the Base64 string to raw binary with atob()
// 4. Converting each character to its char code to produce a Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

// Wraps a promise with a timeout so a hung native permission dialog
// (e.g. broken TWA delegation) fails loudly instead of leaving the
// button stuck on "Enabling..." forever with no signal.
function withTimeout(promise, ms, timeoutMessage) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(timeoutMessage)), ms)
        ),
    ]);
}

// Background sync hook — runs silently on every login via App.js.
// Checks if the browser already has an active push subscription and,
// if so, posts it to the backend to keep the two in sync.
// Handles the case where the backend lost the subscription record
// (e.g. after a database restore) without the user having to do anything.
// Also exposes notifStatus, enableNotifications, and disableNotifications
// for use in AccountSettings.js and Log.js.
function usePushNotifications(isAuthenticated) {
    useEffect(() => {
        if (!isAuthenticated) return;
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
        if (Notification.permission === 'denied') return;
        if (localStorage.getItem(PUSH_PREF_KEY) === 'false') return;

        const syncSubscription = async () => {
            try {
                const registration = await navigator.serviceWorker.ready;
                const currentSubscription = await registration.pushManager.getSubscription();

                if (!currentSubscription) {
                    console.log('No active push subscription to sync');
                    return;
                }

                const subscriptionJson = currentSubscription.toJSON();
                if (!subscriptionJson.keys || !subscriptionJson.keys.p256dh || !subscriptionJson.keys.auth) {
                    console.warn('Degraded subscription detected, skipping sync');
                    return;
                }

                await api.post('/push/subscribe/', {
                    endpoint: subscriptionJson.endpoint,
                    p256dh: subscriptionJson.keys.p256dh,
                    auth: subscriptionJson.keys.auth,
                });
                console.log('✅ Push subscription synced');
            } catch (error) {
                console.error('Push subscription sync failed:', error);
            }
        };

        syncSubscription();
    }, [isAuthenticated]);

    // 'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed'
    const [notifStatus, setNotifStatus] = useState('loading');
    // Loading state while enable/disable operations are in progress
    const [isNotifLoading, setIsNotifLoading] = useState(false);
    // Holds any error message shown to the user in the notifications section
    const [notifError, setNotifError] = useState(null);

    const checkNotifStatus = useCallback(async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setNotifStatus('unsupported');
            return;
        }
        if (Notification.permission === 'denied') {
            setNotifStatus('denied');
            return;
        }
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setNotifStatus(subscription ? 'subscribed' : 'unsubscribed');
        } catch (e) {
            setNotifStatus('unsubscribed');
        }
    }, []);

    useEffect(() => {
        checkNotifStatus();
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') checkNotifStatus();
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [checkNotifStatus]);

    // Clear any stale notification error whenever the status resolves to a definitive state
    // Prevents error messages from lingering after the situation has already been resolved
    useEffect(() => {
        if (['subscribed', 'unsubscribed', 'denied', 'unsupported'].includes(notifStatus)) {
            setNotifError(null);
        }
    }, [notifStatus]);

const enableNotifications = async () => {
    setIsNotifLoading(true);
    setNotifError(null);
    try {
        const registration = await navigator.serviceWorker.ready;

        // Explicit request — this is the call the TWA delegation service
        // is documented to intercept, unlike the implicit prompt
        // triggered by pushManager.subscribe() alone
        const permission = await withTimeout(
            Notification.requestPermission(),
            15000,
            'Notification.requestPermission() did not resolve within 15s'
        );
        if (permission !== 'granted') {
            setNotifStatus(permission === 'denied' ? 'denied' : 'unsubscribed');
            return false;
        }

        const { data } = await api.get('/push/vapid-public-key/');
        const applicationServerKey = urlBase64ToUint8Array(data.vapidPublicKey);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
        });

        const subscriptionJson = subscription.toJSON();
        const payload = {
            endpoint: subscriptionJson.endpoint,
            p256dh: subscriptionJson.keys.p256dh,
            auth: subscriptionJson.keys.auth,
        };

        try {
            await api.post('/push/subscribe/', payload);
        } catch {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await api.post('/push/subscribe/', payload);
        }

        localStorage.setItem(PUSH_PREF_KEY, 'true');
        setNotifStatus('subscribed');
        return true;
        } catch (e) {
            if (Notification.permission === 'denied') {
                // Expected outcome, not a bug — don't report to Sentry
                setNotifStatus('denied');
            } else {
                // Genuine failure: timeout, subscribe failure, backend failure, etc.
                setNotifError('Something went wrong. Please try again.');
                Sentry.captureException(e);
            }
            console.error('Failed to enable notifications:', e);
            return false;
        } finally {
            setIsNotifLoading(false);
        }};

    const disableNotifications = async () => {
        // Clear any previous error and show loading state on the button
        setIsNotifLoading(true);
        setNotifError(null);
        try {
            // Set localStorage flag first so the hook knows this was intentional
            localStorage.setItem(PUSH_PREF_KEY, 'false');
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await api.delete('/push/subscribe/', {
                    data: { endpoint: subscription.endpoint }
                });
                await subscription.unsubscribe();
            }
            setNotifStatus('unsubscribed');
        } catch (e) {
            setNotifError('Could not disable notifications. Please try again.');
            console.error('Failed to disable notifications:', e);
        } finally {
            setIsNotifLoading(false);
        }
    };

    return { notifStatus, isNotifLoading, notifError, enableNotifications, disableNotifications };
}

export default usePushNotifications;