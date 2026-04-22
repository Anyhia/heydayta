import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '1rem', color: 'var(--grey-text-muted)', textAlign: 'center' }}>
                    Something went wrong loading your logs. Pull down to refresh.
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;