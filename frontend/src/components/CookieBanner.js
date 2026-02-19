import { useState, useEffect } from 'react';
import './CookieBanner.css';

function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show banner only if user hasn't acknowledged it yet
        const acknowledged = localStorage.getItem('cookie_acknowledged');
        if (!acknowledged) {
            // Small delay so it doesn't flash on first render
            const timer = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcknowledge = () => {
        localStorage.setItem('cookie_acknowledged', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className='cookie-banner'>
            <div className='cookie-banner-content'>
                <span className='cookie-icon'>🍪</span>
                <p className='cookie-text'>
                    HeyDayta uses a strictly necessary <strong>httpOnly cookie</strong> to keep you securely logged in.
                    No tracking, no ads — just authentication.{' '}
                    <a href='/privacy-policy' className='cookie-link'>Learn more</a>
                </p>
                <button className='cookie-button' onClick={handleAcknowledge}>
                    Got it
                </button>
            </div>
        </div>
    );
}

export default CookieBanner;