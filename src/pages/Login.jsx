import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const { login, user, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [navigate, user, redirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        try {
            const data = await googleLogin(credentialResponse.credential);
            if (data && data.success) {
                setSuccessMsg(data.message);
            } else if (data.isNewUser) {
                navigate(`/complete-profile?redirect=${redirect}`);
            } else {
                navigate(redirect);
            }
        } catch (err) {
            setError(err.message || 'Google login failed');
        }
    };

    if (successMsg) {
        return (
            <div className="login-container" style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '40px 20px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}>
                <div style={{ marginBottom: '32px', position: 'absolute', top: '40px' }}>
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
                
                <div className="login-card" style={{ 
                    width: '100%', 
                    maxWidth: '480px', 
                    backgroundColor: 'white', 
                    borderRadius: '24px', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
                    padding: '48px 40px',
                    border: '1px solid rgba(255,255,255,0.8)',
                    textAlign: 'center'
                }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#38a169', fontSize: '32px' }}>
                        <i className="far fa-envelope"></i>
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: '#1a202c' }}>Check your email</h1>
                    <p style={{ color: '#4a5568', marginBottom: '32px', lineHeight: '1.6' }}>{successMsg}</p>
                    <button onClick={() => setSuccessMsg('')} style={{
                        display: 'block',
                        width: '100%',
                        padding: '16px',
                        backgroundColor: '#1a1a1a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}>
                        BACK TO LOGIN
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container" style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
            <div className="login-card" style={{ 
                width: '100%', 
                maxWidth: '440px', 
                backgroundColor: 'white', 
                borderRadius: '24px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
                padding: '48px 40px',
                border: '1px solid rgba(255,255,255,0.8)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ 
                        fontSize: '32px', 
                        fontWeight: '800', 
                        color: '#1a202c',
                        marginBottom: '12px',
                        letterSpacing: '-0.5px'
                    }}>Welcome back!</h1>
                    <p style={{ color: '#718096', fontSize: '15px' }}>Enter your details to sign in</p>
                </div>

                {error && (
                    <div style={{ 
                        backgroundColor: '#fef2f2', 
                        color: '#dc2626', 
                        padding: '14px 16px', 
                        borderRadius: '12px', 
                        marginBottom: '28px', 
                        fontSize: '14px',
                        border: '1px solid #fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '10px', 
                            fontSize: '14px', 
                            fontWeight: '600',
                            color: '#4a5568'
                        }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="mail@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '15px 18px', 
                                borderRadius: '14px', 
                                border: '1px solid #e2e8f0', 
                                outline: 'none',
                                fontSize: '15px',
                                transition: 'all 0.2s ease',
                                backgroundColor: '#f9fafb'
                            }}
                            className="auth-input"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <label style={{ 
                                fontSize: '14px', 
                                fontWeight: '600',
                                color: '#4a5568'
                            }}>Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '13px', color: '#E41E26', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</Link>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '15px 18px', 
                                borderRadius: '14px', 
                                border: '1px solid #e2e8f0', 
                                outline: 'none',
                                fontSize: '15px',
                                transition: 'all 0.2s ease',
                                backgroundColor: '#f9fafb'
                            }}
                            className="auth-input"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            padding: '16px', 
                            backgroundColor: '#E41E26', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '14px', 
                            fontWeight: '700', 
                            cursor: loading ? 'not-allowed' : 'pointer', 
                            fontSize: '16px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 20px rgba(228, 30, 38, 0.2)',
                            marginBottom: '24px'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    margin: '24px 0', 
                    color: '#cbd5e0'
                }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                    <span style={{ padding: '0 15px', fontSize: '13px', color: '#a0aec0', fontWeight: '500' }}>OR CONTINUE WITH</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                </div>

                <div style={{ width: '100%' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Authentication Failed')}
                        useOneTap
                        width="100%"
                        shape="pill"
                        theme="outline"
                        text="signin_with"
                    />
                </div>

                <div style={{ 
                    marginTop: '32px', 
                    textAlign: 'center', 
                    fontSize: '15px', 
                    color: '#718096' 
                }}>
                    New to our store? <Link to={`/register?redirect=${redirect}`} style={{ 
                        color: '#E41E26', 
                        textDecoration: 'none', 
                        fontWeight: '700' 
                    }}>Create an account</Link>
                </div>
            </div>

            <style>{`
                .auth-input:focus {
                    border-color: #E41E26 !important;
                    background-color: #fff !important;
                    box-shadow: 0 0 0 4px rgba(228, 30, 38, 0.05);
                }
            `}</style>
        </div>
    );
};

export default Login;
