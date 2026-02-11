import { Dropdown, Container} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {useAuth} from './Auth/AuthProvider';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';
import api from '../api';

function NavBar() {
    const [now, setNow] = useState(new Date());

    const [username, setUsername] = useState(null);  
    const { isAuthenticated, loading } = useAuth();  // ← Get token from context

    // Fetch username when component mounts (if user is logged in)
    useEffect(() => {
        const fetchUsername = async () => {
            // Wait until loading is done
            if (loading) {
                return;  // Don't fetch yet
            }
            
            if (!isAuthenticated) {  // ← Check isAuthenticated, not token
                setUsername(null);
                return;
            }
            
            try {
                const response = await api.get('/accounts/me/');
                setUsername(response.data.username);
            } catch (error) {
                console.error('Failed to fetch username:', error);
                setUsername(null);
            }
        };

        fetchUsername();
    }, [isAuthenticated, loading]);

    // Clock timer
    useEffect(() =>{
        const timer = setInterval(() => {
            setNow(new Date()); // updates 'now' with the current time
        }, 1000) // setInterval starts a timer inside the browser that runs setNow function every second

        return () => clearInterval(timer); // Clear the timer
        
    }, []);

    // Get the time, ignore the seconds
    const hour = now.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    });

    // Get the date
    const date = now.toLocaleDateString([], {
                         year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    });

    const datetime = `${date} · ${hour}`;

    return(        
        <Container className="nav-container">
            <div className='heydayta'>HEYDAYTA</div>
            <div className='bar'>
                STARDATE: {datetime}
                {username && (
                    <>
                        <span className='separator'> | </span>
                        <span className='captain-wrapper'>
                            <span className='captain-label'>CAPTAIN: </span>
                            <span className='captain-username'>{username}</span>
                        </span>
                    </>
                )}
            </div>
 
            <Dropdown className='user-dropdown'>
                <Dropdown.Toggle className='user-toggle'><FontAwesomeIcon icon={faUser} className='user-icon'/></Dropdown.Toggle>
                <Dropdown.Menu className='user-menu'>
                    {username && (
                        <Dropdown.Header className='user-header'>
                            {username}
                        </Dropdown.Header>
                    )}
                    {username && (
                        <Dropdown.Item className='user-item' as={Link} to="/createlog">
                            Home
                        </Dropdown.Item>
                    )}
                    <Dropdown.Item className='user-item' as={Link} to="/login">Login</Dropdown.Item>
                    <Dropdown.Item className='user-item' as={Link} to="/logout">Logout</Dropdown.Item>
                    <Dropdown.Item className='user-item' as={Link} to="/about">About</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Container>
    )
}

export default NavBar