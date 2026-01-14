import { Container, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight, faCalendar, faBrain, faLock} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom'; 
import Mascot from '../media/images/Mascot.png';
import './About.css';
import { useAuth } from './Auth/AuthProvider'; 
import { useEffect } from 'react'; 

function About() {
    const { token, loading } = useAuth(); // Get token and loading state
    const navigate = useNavigate();

    // Redirect to createlog if user is already logged in
    useEffect(() => {
        if (!loading && token) {
            navigate('/createlog');
        }
    }, [token, loading, navigate]);
    
    return (
        <Container className='about-container'>
            <Container className='mascot-container'>
                <div className='title-and-description'>
                    <div className='title'>
                        Your Personal <span className='memory-vault'>Memory Vault</span>
                    </div>
                    <div className='description'>
                        HeyDayta helps you capture life's moments and find them again in seconds. Write journals, set smart reminders, and ask questions about your past, all in one place.
                    </div>
                </div>
                <img src={Mascot} alt="HeyDayta mascot" className="mascot-image"/>

            </Container>
            <Button className='get-started-button' as={Link} to="/login">Get started<span><FontAwesomeIcon className='ms-3' icon={faArrowRight} /></span></Button>
            
            <Container className='show-descriptions'>
                <div className='description-card blue'>
                    <div className='description-card-icon icon-blue'><FontAwesomeIcon icon={faCalendar} /></div>
                    <div className='description-card-title'>Journal & Reminders</div>
                    <div className='description-card-text'>Capture daily moments and never forget important tasks.</div>
                </div>
                <div className='description-card purple'>
                    <div className='description-card-icon icon-purple'><FontAwesomeIcon icon={faBrain} /></div>
                    <div className='description-card-title'>Smart Search</div>
                    <div className='description-card-text'>Ask questions in plain language and get instant answers from your past entries.</div>
                </div>
                <div className='description-card orange'>
                    <div className='description-card-icon icon-orange'><FontAwesomeIcon icon={faLock} /></div>
                    <div className='description-card-title'>Private & Secure</div>
                    <div className='description-card-text'>Your memories are yours alone, completely private and secure.</div>
                </div>
            </Container>
        
        </Container>
    )
}

export default About