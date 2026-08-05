import { Container, Button, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthProvider';
import api from '../api';
import usePushNotifications from '../hooks/usePushNotifications';
import './AccountSettings.css';

function AccountSettings() {
    const [userInfo, setUserInfo] = useState(null);
    // controls whether the delete account confirmation box is visible. Starts as false (hidden).
    // Becomes true when the user clicks "Delete Account"
    const [showConfirm, setShowConfirm] = useState(false);
    // tracks what the user is typing into the confirmation input.
    // The delete button only becomes active when this equals the string 'DELETE' exactly.
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState(null);
    // tracks whether the delete account API call is in progress.
    // While true, the "Permanently Delete" button shows a spinner and is disabled so the user can't click it twice.
    const [isDeleting, setIsDeleting] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Push notification state and actions come from the shared hook.
    // Passing true because AccountSettings is always rendered for authenticated users only.
    const { notifStatus, isNotifLoading, notifError, enableNotifications, disableNotifications } = usePushNotifications(true);

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
                                    onClick={enableNotifications}
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
                                    onClick={disableNotifications}
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