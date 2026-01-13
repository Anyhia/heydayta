import { GoogleLogin } from '@react-oauth/google';
import api from '../../api';
import { Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

function GoogleLoginButton() {
    // Use the login function from AuthProvider (it calls setApiToken internally)
    const { login } = useAuth();
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
                        // Extract the JWT ID token from Google's response
                        const googleIdToken = credentialResponse.credential;
                        
                        // Send the ID token to Django backend for verification
                        const response = await api.post('/accounts/google/', {
                            token: googleIdToken
                        });
                        
                        // Use AuthProvider's login function to set token AND update Axios
                        login(response.data.access, response.data.username);
                        
                        // Navigate to create log page
                        navigate('/createlog');
                        setError(null);
                    } catch(error) {
                        // Handle backend API errors
                        setError(error.response?.data?.error || 'Login failed. Please try again.');
                    }
                }}
                onError={() => {
                    // Handle Google OAuth frontend errors
                    setError('Google authentication failed');
                }}
            />
        </div>
    );
}

export default GoogleLoginButton;