import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import api from '../../api';

//  Create context for token
const AuthContext = createContext();
// Create a custom hook to make it easier to use the context data in the components
// Instead of writing useContext(AuthContext), I use useAuth
export const useAuth = () => useContext(AuthContext);
function AuthProvider({ children }) {
    const [username, setUsername] = useState(null);
    const [token, setToken] = useState(null);
    // Authentication check is async, but routing happens synchronously. 
    // When the page loads, token is initially null while the refresh request is still pending, 
    // causing an immediate redirect to login. 
    // Add loading state, so the user is not redirected to login, during the refresh request
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        //Only first time the app loads
        const restoreSession = async () => {
            setLoading(true) 
            try {
                const response = await api.post('/token/refresh/');
                setToken(response.data.access);

            } catch (error) {
                setToken(null);

            } finally {
                setLoading(false);
            }
        };

  restoreSession();
}, []); // Only runs once on app load
    //  Login function - API call and save the tokens
    const login = async (userData) => {
        try {
            const response = await api.post('/token/', userData);

            setToken(response.data.access);
            setUsername(response.data.user);
        } catch (error) {
            throw error;
        }
    }
    const logout = useCallback(async () => {
        try {
            await api.post('/accounts/logout/');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setToken(null);
            setUsername(null);
        }
    }, []);
    
    return (
    // AuthContext.Provider delivers the values to the rest of the app
    <AuthContext.Provider value={{ token, setToken, login, logout, username, setUsername, loading }}>
        {children}
    </AuthContext.Provider>
    );
}
export default AuthProvider


