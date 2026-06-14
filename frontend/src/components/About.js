import { Container, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight, faMicrophone, faBell, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom'; 
import './About.css';
import { useAuth } from './Auth/AuthProvider'; 
import { useEffect, useState, useRef } from 'react'; 

const QUESTION = "Where did I park today?";
const ANSWER = "You parked in spot B7, level 2, at the north entrance today.";
const JOURNAL_TEXT = "Parked in spot B7, level 2, north entrance.";

function DemoAnimation() {
    const prefersReduced = useRef(
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    const [typedText, setTypedText] = useState(prefersReduced.current ? QUESTION : '');
    const [showCursor, setShowCursor] = useState(false);
    const [showAnswer, setShowAnswer] = useState(prefersReduced.current);
    const mountedRef = useRef(true);
    const timersRef = useRef([]);

    const schedule = (fn, delay) => {
        const id = setTimeout(() => {
            if (mountedRef.current) fn();
        }, delay);
        timersRef.current.push(id);
    };

    useEffect(() => {
        mountedRef.current = true;
        timersRef.current = [];
        if (prefersReduced.current) return;

        let charIndex = 0;

        function reset() {
            charIndex = 0;
            setTypedText('');
            setShowAnswer(false);
            setShowCursor(false);
        }

        function typeNext() {
            charIndex++;
            setTypedText(QUESTION.slice(0, charIndex));
            if (charIndex < QUESTION.length) {
                schedule(typeNext, 50);
            } else {
                schedule(() => {
                    setShowCursor(false);
                    schedule(() => {
                        setShowAnswer(true);
                        schedule(() => {
                            reset();
                            schedule(startSequence, 800);
                        }, 4000);
                    }, 300);
                }, 200);
            }
        }

        function startSequence() {
            setShowCursor(true);
            schedule(typeNext, 50);
        }

        schedule(startSequence, 800);

        return () => {
            mountedRef.current = false;
            timersRef.current.forEach(clearTimeout);
            timersRef.current = [];
        };
    }, []);

    return (
        <div className='about-demo'>
            <div className='about-demo-journal'>
                <div className='about-demo-input-wrapper'>
                    <span className='about-demo-text'>{JOURNAL_TEXT}</span>
                    <FontAwesomeIcon icon={faMicrophone} className='about-demo-icon' />
                </div>
                <div className='about-demo-footer'>
                    <span className='about-demo-log-btn'>Log it</span>
                </div>
            </div>

            <div className='about-demo-ask'>
                <div className='about-demo-input-wrapper'>
                    <span className='about-demo-text'>
                        {typedText}
                        {showCursor && <span className='about-demo-cursor'>|</span>}
                    </span>
                    <FontAwesomeIcon icon={faMicrophone} className='about-demo-icon' />
                </div>
                <div className='about-demo-footer'>
                    <span className='about-demo-ask-btn'>Ask it</span>
                </div>
                {showAnswer && (
                    <div className='about-demo-response'>
                        <span className='about-demo-response-arrow'>↳</span>
                        <span className='about-demo-response-text'>{ANSWER}</span>
                    </div>
                )}
            </div>
        </div>
    );
}


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

            <div className='about-hero'>
                <div className='about-hero-left'>
                    <div className='title-and-description'>
                        <div className='title'>
                            <div>You say it. <span className='memory-vault'>HeyDayta remembers.</span></div>
                            <div>You ask it. <span className='memory-vault'>HeyDayta answers.</span></div>
                        </div>
                        <div className='description'>
                            Ask your notes anything.
                        </div>
                    </div>
                    <Button className='get-started-button' as={Link} to="/login">Get started<span><FontAwesomeIcon className='ms-3' icon={faArrowRight} /></span></Button>
                    <div className='how-to-use-hint'>
                        New here? <Link to="/how-to-use" className='how-to-use-link'>See how it works</Link>
                    </div>
                    <p className='privacy-note'>Private by default. No ads. No data selling.</p>
                </div>

                <div className='about-hero-right'>
                    <DemoAnimation />
                </div>
            </div>

            <Container className='show-descriptions'>
                <div className='description-card orange'>
                    <div className='description-card-icon icon-orange'><FontAwesomeIcon icon={faMicrophone} /></div>
                    <div className='description-card-title'>Write it, say it, forget it</div>
                    <div className='description-card-text'>Write or speak naturally. HeyDayta remembers the details.</div>
                </div>
                <div className='description-card blue'>
                    <div className='description-card-icon icon-blue'><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
                    <div className='description-card-title'>Ask. Don't search.</div>
                    <div className='description-card-text'>When you need something from your past, just ask. Like talking to someone who remembers everything.</div>
                </div>
                <div className='description-card orange'>
                    <div className='description-card-icon icon-orange'><FontAwesomeIcon icon={faBell} /></div>
                    <div className='description-card-title'>Reminders that understand you</div>
                    <div className='description-card-text'>No date pickers, no dropdowns. HeyDayta figures it out.</div>
                </div>
            </Container>

        </Container>
    )
}

export { About, AboutPage };