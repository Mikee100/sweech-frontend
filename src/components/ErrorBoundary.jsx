import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service here
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ 
                    minHeight: '100vh', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '40px 20px',
                    textAlign: 'center',
                    background: '#f8fafc' 
                }}>
                    <div style={{ 
                        backgroundColor: 'white', 
                        padding: '48px 40px', 
                        borderRadius: '24px', 
                        boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
                        maxWidth: '500px',
                        width: '100%'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                            Oops! 🔧
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a202c', marginBottom: '16px' }}>
                            Something went wrong
                        </h1>
                        <p style={{ color: '#4a5568', marginBottom: '32px', lineHeight: '1.6' }}>
                            An unexpected error occurred in the application. Please try refreshing the page or navigating back to safety.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <button 
                                onClick={() => window.location.reload()}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#E41E26',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                Refresh Page
                            </button>
                            <button 
                                onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#e2e8f0',
                                    color: '#4a5568',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                Go Home
                            </button>
                        </div>
                        
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div style={{ marginTop: '32px', textAlign: 'left', backgroundColor: '#fed7d7', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>
                                <p style={{ color: '#c53030', fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '14px' }}>Developer Details:</p>
                                <pre style={{ margin: 0, fontSize: '12px', color: '#742a2a' }}>{this.state.error.toString()}</pre>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
