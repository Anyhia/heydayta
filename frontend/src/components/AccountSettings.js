import { useState, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthProvider';
import api from '../api';
import './AccountSettings.css';

function AccountSettings() {
    const [userInfo, setUserInfo] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

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
                            <span className='settings-info-value'>{userInfo.email || '—'}</span>
                        </div>
                    </div>
                ) : (
                    <div className='settings-loading'>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Loading...
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className='settings-section danger-zone'>
                <h2 className='settings-section-title danger-title'>Danger Zone</h2>
                <div className='settings-danger-card'>
                    <div className='settings-danger-info'>
                        <p className='settings-danger-heading'>Delete Account</p>
                        <p className='settings-danger-text'>
                            Permanently deletes your account and all associated data — journal entries,
                            reminders, and embeddings. This action <strong>cannot be undone</strong>.
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