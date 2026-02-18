import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="error-page-container">
            <div className="error-scanline" />
            <div className="error-content">
                <div className="error-code-label">STARDATE ERROR</div>
                <div className="error-code">404</div>
                <div className="error-divider" />
                <h1 className="error-title">Sector Not Found</h1>
                <p className="error-message">
                    Captain's Log — The destination you seek does not exist in our star charts.
                    This sector may have been decommissioned or never charted.
                </p>
                <div className="error-actions">
                    <button className="error-btn-primary" onClick={() => navigate('/')}>
                        Return to Base
                    </button>
                    <button className="error-btn-secondary" onClick={() => navigate(-1)}>
                        Previous Sector
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;