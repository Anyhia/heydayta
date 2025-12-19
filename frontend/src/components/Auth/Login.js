import {Container, Button, Form, InputGroup, Alert} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faLock, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {useEffect, useRef, useState} from 'react';
import {useAuth} from './AuthProvider';
import {useNavigate} from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import Mascot from '../../media/images/Mascot.png';
import './Login.css'


const Login = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    // Set focus on username input
    const userRef= useRef();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    const [username,setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // for error messages, if any
    

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            // Call the login function from AuthProvider(authentication context)
            await login({username, password});
            navigate('/createlog');
        } catch(error) {
            setError('Invalid credential');
        }
    };

    return (
        <Container className='login-page-container'>
            <img src={Mascot} alt="HeyDayta mascot" className="mascot-image-login"/>
            <div className="login-container">
                <div className='welcome-back'>
                    <div className='welcome-text'>Welcome Back</div>
                    <div className='login-text'>Log in to access your memory vault</div>
                </div>
                <Form noValidate onSubmit={handleSubmit} id='login-form'>
                    {/* If error has a value, show the Alert */}
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Form.Group controlId="loginUsername" className='mb-4'>
                        <Form.Label className='label'>Username</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text className='input-icon' id='inputUsername'><FontAwesomeIcon icon={faUser}/></InputGroup.Text>
                            <Form.Control
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                                ref={userRef}
                                value={username}
                                required
                                type="text"
                                placeholder="Ex: BoldlyGoose101"
                                className='input-login'
                            />
                            <Form.Control.Feedback type='invalid'>This username is invalid</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                
                    <Form.Group controlId="registerPassword">
                        <Form.Label className='label'>Password</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text className='input-icon'><FontAwesomeIcon icon={faLock}/></InputGroup.Text>
                            <Form.Control
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                value={password}
                                required
                                type="password"
                                placeholder="••••••••"
                                className='input-login'
                            />
                            <Form.Control.Feedback type="invalid">
                                Password is incorrect
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                
                    <Button type="submit" className='login-button'>Log in <FontAwesomeIcon className='ms-3' icon={faArrowRight} /></Button>
                </Form>
                <div className='google-option'>
                    <div className='google-option-text'>Or continue with Google</div>
                    <GoogleLoginButton />
                </div>
                <div className='sign-up-option'>
                    <Link className="sign-up" to="/register">
                        Don't have an account?<span className='sign-up-text'>Sign Up</span>
                    </Link>
                </div>
            </div>
        </Container>
        
    )
}

export default Login