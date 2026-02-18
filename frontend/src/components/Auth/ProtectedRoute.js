import {Navigate} from 'react-router-dom';
import {useAuth} from './AuthProvider';

function ProtectedRoute({children}) {
    const {isAuthenticated, loading} = useAuth();
    if(loading) {
        return ( 
            <div className="loading-screen">
                <div className="spinner" />
                <p className="loading-text">Initializing your memory vault...</p>
            </div>
        )
    }
    if(!isAuthenticated) {  // ← Check isAuthenticated instead of token
        return <Navigate to='/login' replace />; 
    }
    // If logged in,show the component
    return children;
}
export default ProtectedRoute;