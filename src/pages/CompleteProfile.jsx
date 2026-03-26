import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CompleteProfile = () => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.name) {
            setName(user.name);
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!phone) {
            setError('Phone number is required');
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            await updateProfile({
                name,
                phone,
                city
            });
            navigate(redirect);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="complete-profile-page container" style={{ 
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
            
            <div style={{ backgroundColor: 'white', padding: '48px 40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', width: '100%', maxWidth: '480px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '12px', fontSize: '28px', fontWeight: '800' }}>Almost There!</h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px', fontSize: '15px' }}>
                    Just a few more details to complete your registration.
                </p>

                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '14px', 
                                borderRadius: '10px', 
                                border: '1px solid #e2e8f0', 
                                outline: 'none',
                                fontSize: '15px',
                                transition: 'border-color 0.2s'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' }}>Mobile Number</label>
                        <input
                            type="tel"
                            placeholder="e.g. 0712 345 678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '14px', 
                                borderRadius: '10px', 
                                border: '1px solid #e2e8f0', 
                                outline: 'none',
                                fontSize: '15px'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' }}>City / Town (Optional)</label>
                        <input
                            type="text"
                            placeholder="Where do you live?"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '14px', 
                                borderRadius: '10px', 
                                border: '1px solid #e2e8f0', 
                                outline: 'none',
                                fontSize: '15px'
                            }}
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
                            borderRadius: '12px', 
                            fontWeight: 'bold', 
                            cursor: loading ? 'not-allowed' : 'pointer', 
                            fontSize: '16px',
                            boxShadow: '0 4px 12px rgba(228, 30, 38, 0.2)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {loading ? 'SAVING...' : 'COMPLETE REGISTRATION'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
