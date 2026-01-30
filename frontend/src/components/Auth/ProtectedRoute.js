import {Navigate} from 'react-router-dom';
import {useAuth} from './AuthProvider';

function ProtectedRoute({children}) {
    const {isAuthenticated, loading} = useAuth();
    if(loading) {
        return <div>Loading...</div> // Add a spiner
    }
    if(!isAuthenticated) {  // ← Check isAuthenticated instead of token
        return <Navigate to='/login' replace />; 
    }
    // If logged in,show the component
    return children;
}
export default ProtectedRoute;