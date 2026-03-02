import { useEffect } from 'react';
import api from '../api';

// Converts a base64 VAPID public key string to the Uint8Array
// format that the browser's PushManager.subscribe() requires
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function usePushNotifications(isAuthenticated) {
    useEffect(() => {
        if (!isAuthenticated) return;

        // Browser support check
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.log('Push notifications not supported in this browser');
            return;
        }

        // If the user already denied, don't ask again — respect their choice
        if (Notification.permission === 'denied') {
            console.log('Push notifications denied by user');
            return;
        }

        const subscribe = async () => {
            try {
                // Get the registered service worker
                const registration = await navigator.serviceWorker.ready;

                // Check if already subscribed — avoid creating duplicates
                const existingSubscription = await registration.pushManager.getSubscription();
                if (existingSubscription) {
                    console.log('Already subscribed to push notifications');
                    return;
                }

                // Fetch VAPID public key from Django
                const { data } = await api.get('/push/vapid-public-key/');
                const applicationServerKey = urlBase64ToUint8Array(data.vapidPublicKey);

                // Ask browser to create a push subscription
                // This triggers the "Allow notifications?" prompt if not yet granted
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true, // Required — push must always show a notification
                    applicationServerKey,
                });

                // Extract keys from the subscription object
                const subscriptionJson = subscription.toJSON();

                // Save subscription to Django
                await api.post('/push/subscribe/', {
                    endpoint: subscriptionJson.endpoint,
                    p256dh: subscriptionJson.keys.p256dh,
                    auth: subscriptionJson.keys.auth,
                });

                console.log('✅ Push subscription saved');
            } catch (error) {
                // User clicked "Block" on the prompt — not an error, just their choice
                if (Notification.permission === 'denied') {
                    console.log('User denied notification permission');
                } else {
                    console.error('Push subscription failed:', error);
                }
            }
        };

        subscribe();
    }, [isAuthenticated]); // Runs when isAuthenticated changes to true
}

export default usePushNotifications;