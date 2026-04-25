import { useEffect } from 'react';
import api from '../api';

export const PUSH_PREF_KEY = 'heydayta_push_enabled';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function usePushNotifications(isAuthenticated) {
    useEffect(() => {
        if (!isAuthenticated) return;

        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.log('Push notifications not supported in this browser');
            return;
        }

        if (Notification.permission === 'denied') {
            console.log('Push notifications denied by user');
            return;
        }

        if (localStorage.getItem(PUSH_PREF_KEY) === 'false') {
            console.log('Push notifications disabled by user preference');
            return;
        }

        const syncSubscription = async () => {
            try {
                const registration = await navigator.serviceWorker.ready;
                const currentSubscription = await registration.pushManager.getSubscription();

                if (!currentSubscription) {
                    console.log('No active push subscription to sync');
                    return;
                }

                const subscriptionJson = currentSubscription.toJSON();

                // Detect degraded subscription missing encryption keys —
                // this happens on Samsung when battery management interrupts
                // Chrome's subscription creation mid-process.
                // Unsubscribe to clear the bad state so the user can re-enable
                // cleanly from Account Settings with a proper user gesture.
                if (!subscriptionJson.keys || !subscriptionJson.keys.p256dh || !subscriptionJson.keys.auth) {
                    console.warn('Degraded push subscription detected. Clearing...');
                    await currentSubscription.unsubscribe();
                    localStorage.setItem(PUSH_PREF_KEY, 'false');
                    return;
                }

                // Keys are present — sync the current endpoint to the server.
                // Fixes Android FCM token rotation: update_or_create on the
                // backend handles duplicates safely.
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
}

export default usePushNotifications;