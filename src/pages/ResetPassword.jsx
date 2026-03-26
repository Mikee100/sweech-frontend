import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/apiClient';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters long');
            return;
        }

        setStatus('loading');
        
        try {
            await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/reset-password/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            
            setStatus('success');
            setMessage('Your password has been successfully reset. You are now logged in and will be redirected to the home page shortly.');
            setTimeout(() => {
                navigate('/');
                window.location.reload(); // To update auth state globally since we're setting cookie
            }, 3000);
        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Network error. Please try again later.');
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
                <h1 style={{ textAlign: 'center', marginBottom: '12px', fontSize: '24px', fontWeight: '800' }}>Choose New Password</h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px', fontSize: '15px' }}>
                    Almost done! Please enter your new password below.
                </p>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#38a169', fontSize: '32px' }}>
                            <i className="fas fa-check"></i>
                        </div>
                        <p style={{ color: '#4a5568', marginBottom: '32px', lineHeight: '1.6', fontWeight: '500' }}>{message}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {status === 'error' && (
                            <div style={{ padding: '12px 16px', backgroundColor: '#fff5f5', color: '#c53030', borderRadius: '8px', fontSize: '14px', borderLeft: '4px solid #e53e3e' }}>
                                {message}
                            </div>
                        )}
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4a5568', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
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

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4a5568', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
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
                            {status === 'loading' ? 'UPDATING...' : 'UPDATE PASSWORD'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
