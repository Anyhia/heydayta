import { GoogleLogin } from '@react-oauth/google';
import api from '../../api';
import { Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import {useAuth} from './AuthProvider';
import {useNavigate} from 'react-router-dom';


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
                // If Google successfully authenticates the user, it sends back JWT tokens
                // Remember: The JWT is just a long string—anyone could send a random string pretending to be a Google token.
                // It needs to be verified in the backend also, using google-auth
                onSuccess={async (credentialResponse) => {
                    try{
                        const googleIdToken = credentialResponse.credential; // JWT tokens from Google
                        const response = await api.post('/accounts/google/', {token: googleIdToken});
                        setToken(response.data.access);
                        setUsername(response.data.username);
                        navigate('/createlog');
                        setError(null)
                    } catch(error) {
                        // Errors from backend/API call
                        setError(error.response?.data?.error || 'Login failed. Please try again.')
                    }
            
                }}
                onError={() => {
                    // Errors from Google OAuth process in the frontend itself
                    setError('Google authetication failed')
                }}
            />
        </div>
    )
};

export default GoogleLoginButton