import { Dropdown, Container} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {useAuth} from './Auth/AuthProvider';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';
import api from '../api';

function NavBar() {
    const [now, setNow] = useState(new Date());
    const [username, setUsername] = useState(null);
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        const fetchUsername = async () => {
            if (loading) return;
            if (!isAuthenticated) {
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

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const hour = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
    const datetime = `${date} · ${hour}`;

    return (
        <div className="nav-wrapper">
            <Container className="nav-container">
                <div className='nav-left'>
                    <span className='heydayta'>HEYDAYTA</span>
                    <span className='nav-dot'></span>
                    <span className='nav-datetime'>
                        {datetime}
                        {username && (
                            <>
                                <span className='separator'> | </span>
                                <span className='captain-username'>{username}</span>
                            </>
                        )}
                    </span>
                </div>
                <Dropdown className='user-dropdown'>
                    <Dropdown.Toggle className='user-toggle'>
                        <FontAwesomeIcon icon={faBars} className='user-icon'/>
                    </Dropdown.Toggle>
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
                        {username && (
                            <Dropdown.Item className='user-item' as={Link} to="/account">
                                Account Settings
                            </Dropdown.Item>
                        )}
                        {!username && (
                            <Dropdown.Item className='user-item' as={Link} to="/login">Login</Dropdown.Item>
                        )}
                        {!username && (
                            <Dropdown.Item className='user-item' as={Link} to="/register">Register</Dropdown.Item>
                        )}
                        {username && (
                            <Dropdown.Item className='user-item' as={Link} to="/logout">Logout</Dropdown.Item>
                        )}
                        <Dropdown.Item className='user-item' as={Link} to="/about">About</Dropdown.Item>
                        <Dropdown.Item className='user-item' as={Link} to="/how-to-use">How to Use</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </div>
    );
}

export default NavBar;