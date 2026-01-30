import { useEffect } from 'react';
import {useAuth} from './AuthProvider';
import {useNavigate} from 'react-router-dom';

const Logout = () => {
    const { logout } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        const getLogout = async() => {
            try {
                await logout();
            } catch(error) {
                console.error('Logout error:', error);
            } finally {
                navigate('/login', { replace: true });
            }
        }   
        
        getLogout();
        
    }, [logout, navigate]);

    return null;
}

export default Logout;