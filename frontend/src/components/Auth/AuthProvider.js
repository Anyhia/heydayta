import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import api from '../../api';


//  Create context for token
const AuthContext = createContext();
// Create a custom hook to make it easier to use the context data in the components
// Instead of writing useContext(AuthContext), I use useAuth
export const useAuth = () => useContext(AuthContext);
function AuthProvider({ children }) {

    const [token, setToken] = useState(null);
    // Authentication check is async, but routing happens synchronously. 
    // When the page loads, token is initially null while the refresh request is still pending, 
    // causing an immediate redirect to login. 
    // Add loading state, so the user is not redirected to login, during the refresh request
    const [loading, setLoading] = useState(true);

    // This is TRUE only when we've confirmed the user has a valid session
    const isAuthenticated = token !== null && !loading;
    useEffect(() => {
        // Only first time the app loads
        const restoreSession = async () => {
            // Don't restore on public pages (login/register) - prevents loop when cookie is missing
            const publicPages = ['/login', '/register', '/'];
            if (publicPages.includes(window.location.pathname)) {
                setLoading(false); // Stop loading so public pages can render
                return; // Exit early - don't try to refresh token
            }
            
            setLoading(true); 
            try {
                const response = await api.post('/token/refresh/'); // Try to get a new access token using the refresh_token cookie
                setToken(response.data.access);
            } catch (error) {
                setToken(null); // User will be redirected to login by ProtectedRoute
            } finally {
                setLoading(false); // ProtectedRoute can now make routing decisions because we're done checking for tokens
            }
        };

        restoreSession();
    }, []); // Only runs once on app load

    //  Login function - API call and save the tokens
    const login = async (userData) => {
        try {
            const response = await api.post('/token/', userData);
            setToken(response.data.access);
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
        }
    }, []);
    
    return (
    // AuthContext.Provider delivers the values to the rest of the app
    <AuthContext.Provider value={{ token, setToken, login, logout, loading, isAuthenticated }}>
        {children}
    </AuthContext.Provider>
    );
}
export default AuthProvider


