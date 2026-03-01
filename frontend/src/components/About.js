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
                        Your brain has better things to do
                    </div>
                </div>
                <img src={Mascot} alt="HeyDayta mascot" className="mascot-image"/>

            </Container>
            <Button className='get-started-button' as={Link} to="/login">Get started<span><FontAwesomeIcon className='ms-3' icon={faArrowRight} /></span></Button>
            
            <Container className='show-descriptions'>
                <div className='description-card blue'>
                    <div className='description-card-icon icon-blue'><FontAwesomeIcon icon={faCalendar} /></div>
                    <div className='description-card-title'>Write it, say it, forget it</div>
                    <div className='description-card-text'>No effort, no organizing. HeyDayta holds onto it so you don't have to.</div>
                </div>
                <div className='description-card purple'>
                    <div className='description-card-icon icon-purple'><FontAwesomeIcon icon={faBrain} /></div>
                    <div className='description-card-title'>Reminders that understand you</div>
                    <div className='description-card-text'>No date pickers, no dropdowns. HeyDayta figures it out.</div>
                </div>
                <div className='description-card orange'>
                    <div className='description-card-icon icon-orange'><FontAwesomeIcon icon={faLock} /></div>
                    <div className='description-card-title'>Ask. Don't search.</div>
                    <div className='description-card-text'>When you need something, just ask. Like talking to someone who remembers everything.</div>
                </div>
            </Container>
        
        </Container>
    )
}

export { About, AboutPage };