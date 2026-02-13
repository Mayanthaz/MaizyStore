import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0f0f23',
                    color: 'white',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ maxWidth: '600px' }}
                    >
                        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#f87171' }}>Something went wrong.</h1>
                        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
                            We apologize for the inconvenience. The application has encountered an unexpected error.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}
                        >
                            Refresh Page
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <pre style={{
                                marginTop: '2rem',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '8px',
                                textAlign: 'left',
                                overflow: 'auto',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#ef4444'
                            }}>
                                {this.state.error.toString()}
                            </pre>
                        )}
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
