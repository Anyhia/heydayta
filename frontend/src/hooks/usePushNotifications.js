import { useEffect } from 'react';
import api from '../api';

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

        const syncSubscription = async () => {
            try {
                const registration = await navigator.serviceWorker.ready;
                let currentSubscription = await registration.pushManager.getSubscription();

                if (!currentSubscription) {
                    // No subscription exists — create one (triggers permission prompt
                    // if not yet granted, which is correct for a reminders app)
                    const { data } = await api.get('/push/vapid-public-key/');
                    const applicationServerKey = urlBase64ToUint8Array(data.vapidPublicKey);
                    currentSubscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey,
                    });
                }

                // Always POST the current subscription to keep the server in sync.
                // This fixes the Android FCM token rotation issue — when Chrome
                // internally refreshes the push endpoint, we sync the new one
                // to the server on every app open. update_or_create on the backend
                // handles duplicates safely.
                const subscriptionJson = currentSubscription.toJSON();
                await api.post('/push/subscribe/', {
                    endpoint: subscriptionJson.endpoint,
                    p256dh: subscriptionJson.keys.p256dh,
                    auth: subscriptionJson.keys.auth,
                });
                console.log('✅ Push subscription synced');
            } catch (error) {
                if (Notification.permission === 'denied') {
                    console.log('User denied notification permission');
                } else {
                    console.error('Push subscription sync failed:', error);
                }
            }
        };

        syncSubscription();
    }, [isAuthenticated]);
}

export default usePushNotifications;