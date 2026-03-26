import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/apiClient';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) return;

        setStatus('loading');
        
        try {
            await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            setStatus('success');
            setMessage('If an account matches that email, a password reset link has been sent. Please check your inbox.');
        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="container" style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px 20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
            <div style={{ marginBottom: '32px' }}>
                <Link to="/" style={{ 
                    fontSize: '28px', 
                    fontWeight: '900', 
                    color: '#1a1a1a', 
                    textDecoration: 'none',
                    letterSpacing: '-1px'
                }}>
                    <span style={{ color: '#E41E26' }}>C</span>ASEPROZ
                </Link>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '48px 40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', width: '100%', maxWidth: '440px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '12px', fontSize: '24px', fontWeight: '800' }}>Reset Password</h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px', fontSize: '15px' }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#38a169', fontSize: '32px' }}>
                            <i className="far fa-paper-plane"></i>
                        </div>
                        <p style={{ color: '#4a5568', marginBottom: '32px', lineHeight: '1.6', fontWeight: '500' }}>{message}</p>
                        <Link to="/login" style={{
                            display: 'block',
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#1a1a1a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            BACK TO LOGIN
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {status === 'error' && (
                            <div style={{ padding: '12px 16px', backgroundColor: '#fff5f5', color: '#c53030', borderRadius: '8px', fontSize: '14px', borderLeft: '4px solid #e53e3e' }}>
                                {message}
                            </div>
                        )}
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4a5568', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@example.com"
                                style={{ 
                                    width: '100%', 
                                    padding: '14px 16px', 
                                    borderRadius: '12px', 
                                    border: '1px solid #e2e8f0', 
                                    backgroundColor: '#f8fafc',
                                    fontSize: '15px',
                                    transition: 'all 0.2s ease',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={status === 'loading'}
                            style={{ 
                                padding: '16px', 
                                backgroundColor: '#E41E26', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '12px', 
                                fontSize: '16px', 
                                fontWeight: '700', 
                                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                marginTop: '10px',
                                opacity: status === 'loading' ? 0.7 : 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {status === 'loading' ? 'SENDING...' : 'SEND RESET LINK'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <Link to="/login" style={{ fontSize: '14px', color: '#4a5568', textDecoration: 'none', fontWeight: '600' }}>
                                <i className="fas fa-arrow-left" style={{ marginRight: '6px' }}></i> Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
