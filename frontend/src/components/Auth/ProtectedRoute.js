import {Navigate} from 'react-router-dom';
import {useAuth} from './AuthProvider';

function ProtectedRoute({children}) {
    const {token, loading} = useAuth();
    if(loading) {
        return <div>Loading...</div> // Add a spiner
    }
    // If not logged in, redirect to login page
    if(!token) {
        // replace → Tells the browser to replace the current entry in the history stack (so pressing “back” won’t return to the protected page)
        return <Navigate to='/login' replace />; 
    }
    // If logged in,show the component
    return children;
}
export default ProtectedRoute;