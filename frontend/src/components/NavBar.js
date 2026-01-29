import { Dropdown, Container} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {useAuth} from './Auth/AuthProvider';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';

function NavBar() {
    const [now, setNow] = useState(new Date());
    const { username } = useAuth();

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
            <div className='bar'>STARDATE: {datetime}
                {username && (
                    <>
                        <span className='separator'> | </span>
                        <span className='captain'>CAPTAIN: {username}</span>
                    </>
                )}
            </div>
 
            <Dropdown className='user-dropdown'>
                <Dropdown.Toggle className='user-toggle'><FontAwesomeIcon icon={faUser} className='user-icon'/></Dropdown.Toggle>
                <Dropdown.Menu className='user-menu'>
                    <Dropdown.Item className='user-item' as={Link} to="/login">Login</Dropdown.Item>
                    <Dropdown.Item className='user-item' as={Link} to="/logout">Logout</Dropdown.Item>
                    <Dropdown.Item className='user-item' as={Link} to="/">About</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Container>
    )
}

export default NavBar