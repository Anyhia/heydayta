import { GoogleLogin } from '@react-oauth/google';
import api, { setApiToken } from '../../api';  // Import setApiToken
import { Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

function GoogleLoginButton() {
    const { setUsername, setToken } = useAuth();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            <GoogleLogin
                theme="filled_black"
                shape="pill"
                onSuccess={async (credentialResponse) => {
                    try {
                        const googleIdToken = credentialResponse.credential;
                        const response = await api.post('/accounts/google/', {
                            token: googleIdToken
                        });
                        
                        // Set token in React state
                        setToken(response.data.access);
                        // Update Axios authorization header
                        setApiToken(response.data.access);
                        // Set username
                        setUsername(response.data.username);
                        
                        navigate('/createlog');
                        setError(null);
                    } catch(error) {
                        setError(error.response?.data?.error || 'Login failed. Please try again.');
                    }
                }}
                onError={() => {
                    setError('Google authentication failed');
                }}
            />
        </div>
    );
}

export default GoogleLoginButton;