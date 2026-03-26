import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../utils/apiClient';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyUserEmail = async () => {
            try {
                const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/verify/${token}`);
                setStatus('success');
                setMessage('Your email has been successfully verified! You can now log into your account.');
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'An error occurred during verification. Please try again later.');
            }
        };

        if (token) {
            verifyUserEmail();
        }
    }, [token]);

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
            
            <div style={{ backgroundColor: 'white', padding: '48px 40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', width: '100%', maxWidth: '480px', textAlign: 'center' }}>
                {status === 'verifying' && (
                    <>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#3182ce', marginBottom: '20px' }}></i>
                        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Verifying your email...</h1>
                        <p style={{ color: '#666' }}>Please wait a moment while we confirm your email address.</p>
                    </>
                )}
                
                {status === 'success' && (
                    <>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#38a169', fontSize: '32px' }}>
                            <i className="fas fa-check"></i>
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: '#1a202c' }}>Email Verified!</h1>
                        <p style={{ color: '#4a5568', marginBottom: '32px', lineHeight: '1.6' }}>{message}</p>
                        <Link to="/login" style={{
                            display: 'block',
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#E41E26',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            GO TO LOGIN
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fed7d7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#e53e3e', fontSize: '32px' }}>
                            <i className="fas fa-times"></i>
                        </div>
                        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: '#1a202c' }}>Verification Failed</h1>
                        <p style={{ color: '#4a5568', marginBottom: '32px', lineHeight: '1.6' }}>{message}</p>
                        <Link to="/register" style={{
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
                            BACK TO REGISTER
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
