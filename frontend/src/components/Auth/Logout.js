import { useEffect } from 'react';
import {useAuth} from './AuthProvider';
import {useNavigate} from 'react-router-dom';


const Logout = () => {
    const { logout, setToken } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        const getLogout = async() => {
            // Clear token 
            setToken(null);  
            
            try {
                await logout();
            } catch(error) {
                console.error(error);
            } finally {
                // Navigate to login (not home)
                navigate('/login');  
            }
        }   
        
        getLogout();
        
    }, [logout, setToken, navigate]);  // ← Add setToken and navigate to dependencies

    return null;
}

export default Logout;