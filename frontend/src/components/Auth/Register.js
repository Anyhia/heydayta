import {Container, Button, Form, InputGroup, Alert} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faAt, faLock, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../../api';
import GoogleLoginButton from './GoogleLoginButton';
import './Login.css'

// https://dev.to/fromwentzitcame/username-and-password-validation-using-regex-2175
const USERNAME_REGEX = /^[0-9A-Za-z_-]{6,16}$/; 
const PASSWORD_REGEX = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,25}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// see if the passwords match,send an error message if not
const Register = () => {
    const navigate = useNavigate();
    const [validRegistration, setValidRegistration] = useState(false);

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);

    const [passwordMatch, setPasswordMatch] = useState('');
    const [validPasswordMatch, setValidPasswordMatch] = useState(false);

    const [validCheck, setValidCheck] = useState(false);
    const [showError, setShowError] = useState(false);
    const [validAiCheck, setValidAiCheck] = useState(false);
    const [showAiError, setShowAiError] = useState(false);

    const [error, setError] = useState(null);

    // Set focus on username input
    const userRef= useRef()

    useEffect(() => {
        userRef.current.focus();
    }, [])

    // Check username against REGEX and set the result (every time the username changes)
    useEffect(() => {
        const result = USERNAME_REGEX.test(username);
        setValidUsername(result);
    }, [username])

    useEffect (() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    useEffect (() => {
        const result = PASSWORD_REGEX.test(password);
        setValidPassword(result);
        const matchResult = password !== '' && password === passwordMatch;
        setValidPasswordMatch(matchResult);
    }, [password, passwordMatch])

    useEffect (() => {
        if (validEmail && validUsername && validPassword && validPasswordMatch && validCheck && validAiCheck) {
            setValidRegistration(true)
        }
        else {
            setValidRegistration(false)
        }
    },[validUsername,validEmail,validPassword,validPasswordMatch, validCheck, validAiCheck])

    const handleSubmit = (e) => {
        e.preventDefault();
        // e.stopPropagation(); prevents the event from bubbling up to parent elements. This stops parent click handlers from firing.
        if (!validRegistration) {
            if (!validCheck) setShowError(true);
            if (!validAiCheck) setShowAiError(true);
        }
        else {
            const userData={
                username:username,
                email:email,
                password:password,
                passwordMatch:passwordMatch,
            }
            api.post('/accounts/register/', userData)
            .then(() => navigate('/login'))
            .catch((error) => {
                // Check for errors from the servers and display the right message
                if(error.response?.data?.username) {
                    setError(error.response.data.username[0]);
                } else if(error.response?.data?.email) {
                    setError(error.response.data.email[0]);
                } else if(error.response?.data?.message) {
                    setError(error.response.data.message[0]);
                } else {
                    setError('Registration failed')
                }
            })
        }
    };

    return (
        <Container className='login-page-container'>
            <div className='login-container'>
                <div className='welcome-back'>
                    <div className='welcome-text'>Create Account</div>
                </div>
                <Form noValidate onSubmit={handleSubmit} id='register-form'>
                    {/* If error has a value, show the Alert */}
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Form.Group controlId="registerUsername" className='mb-3'>
                        <Form.Label className='label'>Username</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text className='input-icon' id='inputUsername'><FontAwesomeIcon icon={faUser}/></InputGroup.Text>
                            <Form.Control
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                                isInvalid={!validUsername && username!==''}
                                isValid={validUsername && username!==''}
                                value={username}
                                ref={userRef}
                                required
                                type="text"
                                placeholder="Ex: DixonHill101"
                                className='input-login'
                                
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type='invalid'>Username must be 6-16 characters (letters, numbers, _ or -)</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="registerEmail" className='mb-3'>
                        <Form.Label className='label'>Email</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text className='input-icon'><FontAwesomeIcon icon={faAt}/></InputGroup.Text>
                            <Form.Control
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                isValid={validEmail && email !== ''}
                                isInvalid={!validEmail && email !== ''}
                                value={email}
                                required
                                type="text"
                                placeholder="Ex: dixon.hill@email.com"
                                className='input-login'
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please enter a valid email address</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="registerPassword" className='mb-3'>
                        <Form.Label className='label'>Password</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text className='input-icon'><FontAwesomeIcon icon={faLock}/></InputGroup.Text>
                            <Form.Control
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                isInvalid={!validPassword && password !== ''}
                                isValid={validPassword && password !== ''}
                                value={password}
                                required
                                type="password"
                                placeholder="••••••••"
                                className='input-login'
                            />
                            <Form.Control.Feedback>Strong password!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Password must be 8-25 characters with uppercase, lowercase, number, and special character
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="confirmPassword" className='mb-4'>
                        <Form.Label className='label'> Confirm Password</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text className='input-icon'><FontAwesomeIcon icon={faLock}/></InputGroup.Text>
                            <Form.Control
                                onChange={(e) => {
                                    setPasswordMatch(e.target.value)
                                }}
                                isValid={validPasswordMatch && passwordMatch !== ''}
                                isInvalid={!validPasswordMatch && passwordMatch !== ''}
                                value={passwordMatch}
                                required
                                type="password"
                                placeholder="••••••••"
                                className='input-login'
                            />
                            <Form.Control.Feedback>Looks Good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Passwords do not match</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Check
                        type="checkbox"
                        required
                        isInvalid={showError}
                        onChange={(e) => {
                            setValidCheck(e.target.checked);
                            setShowError(false)
                        }}
                        label={
                            <>
                                I agree to the{' '}
                                <a href='/terms-of-service' target='_blank' className='policy-link'>Terms of Service</a>
                                {' '}and{' '}
                                <a href='/privacy-policy' target='_blank' className='policy-link'>Privacy Policy</a>
                            </>
                        }
                        feedback='You must agree with terms and conditions'
                        feedbackType="invalid"
                        className='label'
                    />
                    <Form.Check
                        type="checkbox"
                        required
                        isInvalid={showAiError}
                        onChange={(e) => {
                            setValidAiCheck(e.target.checked);
                            setShowAiError(false);
                        }}
                        label={
                            <>
                                I consent to my journal entries being securely processed by{' '}
                                <a href='https://openai.com/policies/privacy-policy' target='_blank' rel='noreferrer' className='policy-link'>OpenAI</a>
                                {' '}to enable AI search features
                            </>
                        }
                        feedback='You must consent to AI processing to use HeyDayta'
                        feedbackType="invalid"
                        className='label mt-2'
                    />
                    <Button type="submit" className='login-button'>Register<FontAwesomeIcon className='ms-3' icon={faArrowRight} /></Button>
                </Form>
                <div className='google-option'>
                    <div className='google-option-text'>Or continue with Google</div>
                    <GoogleLoginButton />
                    <p className='google-consent-note'>
                        By signing in, you agree to our{' '}
                        <a href='/terms-of-service' target='_blank' className='policy-link'>Terms</a>
                        {' '}&amp;{' '}
                        <a href='/privacy-policy' target='_blank' className='policy-link'>Privacy Policy</a>
                        , and consent to your entries being processed by OpenAI for AI search.
                    </p>
                </div>
                <div className='sign-up-option'>
                    <Link className="sign-up" to="/login">
                        Already have an account?<span className='sign-up-text'>Log In</span>
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default Register