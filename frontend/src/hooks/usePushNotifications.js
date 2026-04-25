import { useEffect } from 'react';
import api from '../api';

export const PUSH_PREF_KEY = 'heydayta_push_enabled';

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

        // If the user explicitly disabled via Account Settings, respect that choice
        if (localStorage.getItem(PUSH_PREF_KEY) === 'false') {
            console.log('Push notifications disabled by user preference');
            return;
        }

        const syncSubscription = async () => {
            try {
                const registration = await navigator.serviceWorker.ready;
                const currentSubscription = await registration.pushManager.getSubscription();

                // Only sync if a subscription already exists — never auto-create one.
                // New subscriptions are created only when the user clicks Enable
                // in Account Settings. This follows browser best practices for push.
                if (!currentSubscription) {
                    console.log('No active push subscription to sync');
                    return;
                }

                // Always POST to keep the server in sync with the current FCM endpoint.
                // Fixes Android token rotation — update_or_create on backend handles
                // duplicates safely.
                const subscriptionJson = currentSubscription.toJSON();
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