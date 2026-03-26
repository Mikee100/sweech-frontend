import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [newsletterOptIn, setNewsletterOptIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [successMsg, setSuccessMsg] = useState('');

    const { register, user, googleLogin } = useAuth();
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
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await register({
                name,
                email,
                password,
                phone,
                city,
                address,
                newsletterOptIn,
            });
            
            // Check if register returned a success without token (Email verification needed)
            if (data && data.success) {
                setSuccessMsg(data.message);
            }
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
            setError(err.message || 'Google Sign Up Failed');
        }
    };

    if (successMsg) {
        return (
            <div className="register-container" style={{ 
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
                
                <div className="register-card" style={{ 
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
                        GO TO LOGIN
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="register-container" style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px 20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
            <div className="register-card" style={{ 
                width: '100%', 
                maxWidth: '800px', 
                backgroundColor: 'white', 
                borderRadius: '32px', 
                boxShadow: '0 25px 70px rgba(0,0,0,0.07)',
                padding: '56px 48px',
                border: '1px solid rgba(255,255,255,0.8)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{ 
                        fontSize: '36px', 
                        fontWeight: '800', 
                        color: '#1a202c',
                        marginBottom: '12px',
                        letterSpacing: '-1px'
                    }}>Create account</h1>
                    <p style={{ color: '#718096', fontSize: '16px' }}>Join us and start shopping premium products</p>
                </div>

                {error && (
                    <div style={{ 
                        backgroundColor: '#fef2f2', 
                        color: '#dc2626', 
                        padding: '16px 20px', 
                        borderRadius: '14px', 
                        marginBottom: '32px', 
                        fontSize: '14px',
                        border: '1px solid #fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                <div style={{ width: '100%', marginBottom: '40px' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Sign Up Failed')}
                        useOneTap
                        width="100%"
                        shape="pill"
                        theme="filled_blue"
                        text="signup_with"
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    margin: '32px 0', 
                    color: '#cbd5e0'
                }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                    <span style={{ padding: '0 20px', fontSize: '13px', color: '#a0aec0', fontWeight: '600' }}>OR REGISTER WITH EMAIL</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                        gap: '24px',
                        marginBottom: '32px'
                    }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={inputStyle}
                                className="auth-input"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Email Address</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                className="auth-input"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Mobile Number</label>
                            <input
                                type="tel"
                                placeholder="e.g. 0712 345 678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={inputStyle}
                                className="auth-input"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>City / Town</label>
                            <input
                                type="text"
                                placeholder="Nairobi"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                style={inputStyle}
                                className="auth-input"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={inputStyle}
                                className="auth-input"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={inputStyle}
                                className="auth-input"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Delivery Address (Optional)</label>
                        <textarea
                            placeholder="Estate, Street, House No."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                            className="auth-input"
                        />
                    </div>

                    <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                            id="newsletter"
                            type="checkbox"
                            checked={newsletterOptIn}
                            onChange={(e) => setNewsletterOptIn(e.target.checked)}
                            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#E41E26' }}
                        />
                        <label htmlFor="newsletter" style={{ cursor: 'pointer', color: '#718096', fontSize: '14px' }}>
                            I'd like to receive updates about new products and special offers.
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            padding: '18px', 
                            backgroundColor: '#E41E26', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '16px', 
                            fontWeight: '700', 
                            cursor: loading ? 'not-allowed' : 'pointer', 
                            fontSize: '17px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 12px 24px rgba(228, 30, 38, 0.2)'
                        }}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{ 
                    marginTop: '40px', 
                    textAlign: 'center', 
                    fontSize: '15px', 
                    color: '#718096' 
                }}>
                    Already have an account? <Link to={`/login?redirect=${redirect}`} style={{ 
                        color: '#E41E26', 
                        textDecoration: 'none', 
                        fontWeight: '700' 
                    }}>Sign In</Link>
                </div>
            </div>

            <style>{`
                .auth-input:focus {
                    border-color: #E41E26 !important;
                    background-color: #fff !important;
                    box-shadow: 0 0 0 4px rgba(228, 30, 38, 0.05);
                    outline: none;
                }
            `}</style>
        </div>
    );
};

const inputStyle = {
    width: '100%', 
    padding: '15px 18px', 
    borderRadius: '14px', 
    border: '1px solid #e2e8f0', 
    outline: 'none',
    fontSize: '15px',
    transition: 'all 0.2s ease',
    backgroundColor: '#f9fafb'
};

export default Register;
