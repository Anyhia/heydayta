import { useEffect } from 'react';
import {useAuth} from './AuthProvider';
import {useNavigate} from 'react-router-dom';


const Logout = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Call the login function from AuthProvider(authentication context)
        const getLogout = async() => {
            try {
                await logout();
                navigate('/');
            } catch(error) {
                console.error(error);
            }
        }   
        
        getLogout()
        
    }, [logout])

    return null;
}

export default Logout