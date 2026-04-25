import { useEffect } from 'react';
import api from '../api';

export const PUSH_PREF_KEY = 'heydayta_push_enabled';

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
}

export default usePushNotifications;