import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

function ServerError() {
    const navigate = useNavigate();
    return (
        <div className="error-page-container error-page-red">
            <div className="error-scanline" />
            <div className="error-content">
                <div className="error-code-label error-label-red">⚠ RED ALERT</div>
                <div className="error-code error-code-red">500</div>
                <div className="error-divider error-divider-red" />
                <h1 className="error-title">Systems Failure</h1>
                <p className="error-message">
                    Captain's Log — A critical system malfunction has been detected.
                    Engineering teams have been notified. Please attempt re-entry.
                </p>
                <div className="error-actions">
                    <button className="error-btn-primary" onClick={() => navigate('/')}>
                        Return to Base
                    </button>
                    <button className="error-btn-secondary" onClick={() => navigate(0)}>
                        Restart Systems
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ServerError;