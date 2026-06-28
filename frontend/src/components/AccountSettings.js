import { Container, Button, Alert } from 'react-bootstrap';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthProvider';
import api from '../api';
import { PUSH_PREF_KEY } from '../hooks/usePushNotifications';
import './AccountSettings.css';

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

function AccountSettings() {
    const [userInfo, setUserInfo] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

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
    }, [checkNotifStatus]);

    // Clear any stale notification error whenever the status resolves to a definitive state
    // Prevents error messages from lingering after the situation has already been resolved
    useEffect(() => {
        if (['subscribed', 'unsubscribed', 'denied', 'unsupported'].includes(notifStatus)) {
            setNotifError(null);
        }
    }, [notifStatus]);

    const handleEnableNotifications = async () => {
        // Clear any previous error and show loading state on the button
        setIsNotifLoading(true);
        setNotifError(null);
        try {
            const registration = await navigator.serviceWorker.ready;

            // Fetch the VAPID public key from the backend
            const { data } = await api.get('/push/vapid-public-key/');
            const applicationServerKey = urlBase64ToUint8Array(data.vapidPublicKey);

            // Ask the browser to create a push subscription
            // If one already exists for this browser, it returns the existing one
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

            // First attempt to save subscription to backend
            try {
                await api.post('/push/subscribe/', payload);
            } catch {
                // First attempt failed — wait 3 seconds and retry once
                // Covers the case where the Heroku dyno is waking up from sleep
                // Safe to retry because the backend uses update_or_create on endpoint
                await new Promise(resolve => setTimeout(resolve, 3000));
                await api.post('/push/subscribe/', payload);
            }

            // Mark user preference in localStorage so usePushNotifications
            // hook knows the user intentionally enabled notifications
            localStorage.setItem(PUSH_PREF_KEY, 'true');
            setNotifStatus('subscribed');
        } catch (e) {
            if (Notification.permission === 'denied') {
                // Permission was denied by the user — update status to reflect that
                setNotifStatus('denied');
            } else {
                // Both attempts failed — browser subscription stays in place
                // so the user can try again and it will retry the API call
                setNotifError('Something went wrong. Please try again.');
            }
            console.error('Failed to enable notifications:', e);
        } finally {
            setIsNotifLoading(false);
        }
    };

    const handleDisableNotifications = async () => {
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

    useEffect(() => {
        api.get('/accounts/me/')
            .then(res => setUserInfo(res.data))
            .catch(() => setError('Could not load account information.'));
    }, []);

    const handleDeleteAccount = async () => {
        if (confirmText !== 'DELETE') return;
        setIsDeleting(true);
        try {
            await api.delete('/accounts/delete/');
            await logout();
            navigate('/');
        } catch (err) {
            setError('Failed to delete account. Please try again or contact hello@heydayta.app.');
            setIsDeleting(false);
        }
    };

    return (
        <Container className='settings-page-container'>
            <div className='settings-header'>
                <div className='settings-stardate'>STARDATE: {new Date().toLocaleDateString()}</div>
                <h1 className='settings-title'>Account Settings</h1>
                <div className='settings-divider' />
            </div>

            {error && <Alert variant='danger' className='mx-3'>{error}</Alert>}

            {/* Account Info */}
            <div className='settings-section'>
                <h2 className='settings-section-title'>Your Account</h2>
                {userInfo ? (
                    <div className='settings-info-card'>
                        <div className='settings-info-row'>
                            <span className='settings-info-label'>Username</span>
                            <span className='settings-info-value'>{userInfo.username}</span>
                        </div>
                        <div className='settings-info-row'>
                            <span className='settings-info-label'>Email</span>
                            {/* 'Not set' shown for Google OAuth users who have no email on record */}
                            <span className='settings-info-value'>{userInfo.email || 'Not set'}</span>
                        </div>
                    </div>
                ) : (
                    <div className='settings-loading'>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Loading...
                    </div>
                )}
            </div>

            {/* Reminder Notifications — renamed from "Notifications" to be more specific */}
            <div className='settings-section'>
                <h2 className='settings-section-title'>Reminder Notifications</h2>
                <div className='settings-info-card'>
                    <div className='settings-info-row'>
                        <span className='settings-info-label'>Push Notifications</span>
                        <span className='settings-info-value'>
                            {/* Updated "Checking..." to be more descriptive */}
                            {notifStatus === 'loading' && 'Checking notification status...'}
                            {notifStatus === 'unsupported' && 'Not supported in this browser.'}
                            {/* Updated denied message to be friendlier and more actionable */}
                            {notifStatus === 'denied' && (
                                'Notifications are blocked for this site. To enable them, allow notifications in your browser or device settings.'
                            )}
                            {notifStatus === 'subscribed' && 'Enabled on this device.'}
                            {notifStatus === 'unsubscribed' && 'Not enabled on this device.'}
                        </span>
                    </div>

                    {notifStatus === 'unsubscribed' && (
                        <>
                            {/* Explains what enabling does before the user commits */}
                            <div className='settings-info-row'>
                                <span className='settings-info-value'>
                                    Receive push notifications when your reminders are due.
                                </span>
                            </div>
                            <div className='settings-info-row'>
                                <Button
                                    className='settings-notif-btn'
                                    onClick={handleEnableNotifications}
                                    disabled={isNotifLoading}
                                >
                                    {isNotifLoading
                                        ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Enabling...</>
                                        : 'Enable Notifications'
                                    }
                                </Button>
                            </div>
                        </>
                    )}

                    {notifStatus === 'subscribed' && (
                        <>
                            <div className='settings-info-row'>
                                <Button
                                    className='settings-notif-btn settings-notif-btn--off'
                                    onClick={handleDisableNotifications}
                                    disabled={isNotifLoading}
                                >
                                    {isNotifLoading
                                        ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Disabling...</>
                                        : 'Disable Notifications'
                                    }
                                </Button>
                            </div>
                            {/* Battery hint shown only after enabling — avoids alarming new users before they try */}
                            <div className='settings-info-row'>
                                <p className='settings-notif-hint'>
                                    On some devices, system settings may prevent notifications from delivering. If reminders do not arrive, check the battery optimisation settings for this app.
                                </p>
                            </div>
                        </>
                    )}

                    {/* User-facing error for enable/disable failures */}
                    {notifError && (
                        <div className='settings-info-row'>
                            <span className='settings-notif-error'>{notifError}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <div className='settings-section danger-zone'>
                <h2 className='settings-section-title danger-title'>Danger Zone</h2>
                <div className='settings-danger-card'>
                    <div className='settings-danger-info'>
                        <p className='settings-danger-heading'>Delete Account</p>
                        {/* Imperative form matches the button label; no 'journal entries', no dashes */}
                        <p className='settings-danger-text'>
                            Permanently delete your account and all associated data. Your notes,
                            reminders and account information will be removed and cannot be recovered.
                        </p>
                    </div>
                    {!showConfirm && (
                        <Button
                            className='settings-delete-btn'
                            onClick={() => setShowConfirm(true)}
                        >
                            Delete Account
                        </Button>
                    )}
                </div>

                {/* Confirmation step */}
                {showConfirm && (
                    <div className='settings-confirm-box'>
                        <p className='settings-confirm-text'>
                            This will permanently delete everything. Type <strong>DELETE</strong> to confirm.
                        </p>
                        <input
                            type='text'
                            className='settings-confirm-input'
                            placeholder='Type DELETE to confirm'
                            value={confirmText}
                            onChange={e => setConfirmText(e.target.value)}
                            autoFocus
                        />
                        <div className='settings-confirm-buttons'>
                            <Button
                                className='settings-cancel-btn'
                                onClick={() => {
                                    setShowConfirm(false);
                                    setConfirmText('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className='settings-confirm-delete-btn'
                                onClick={handleDeleteAccount}
                                disabled={confirmText !== 'DELETE' || isDeleting}
                            >
                                {isDeleting
                                    ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Deleting...</>
                                    : 'Permanently Delete'
                                }
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}

export default AccountSettings;