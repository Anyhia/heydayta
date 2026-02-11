import { Container, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight, faCalendar, faBrain, faLock} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom'; 
import Mascot from '../media/images/Mascot.png';
import './About.css';
import { useAuth } from './Auth/AuthProvider'; 
import { useEffect } from 'react'; 

// with redirect
function AboutPage() {
    const { token, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && token) {
            navigate('/createlog');
        }
    }, [token, loading, navigate]);

    return <AboutContent />;
}

// without redirect
function About() {
    return <AboutContent />;
}

function AboutContent() {
    return (
        <Container className='about-container'>
            <Container className='mascot-container'>
                <div className='title-and-description'>
                    <div className='title'>
                        Remember Everything, <span className='memory-vault'>Find Anything</span>
                    </div>
                    <div className='description'>
                        Write journals and search them in plain language. No tags, no folders, no hassle — just ask and find what you need.
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
                    <div className='description-card-text'>Ask about your past in everyday language. Get instant answers.</div>
                </div>
                <div className='description-card orange'>
                    <div className='description-card-icon icon-orange'><FontAwesomeIcon icon={faLock} /></div>
                    <div className='description-card-title'>Private & Secure</div>
                    <div className='description-card-text'>Completely private. Only you can see your journals.</div>
                </div>
            </Container>
        
        </Container>
    )
}

export { About, AboutPage };