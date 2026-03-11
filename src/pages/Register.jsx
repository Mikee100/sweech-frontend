import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

    const { register, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split('=')[1] : '/';

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
        try {
            await register({
                name,
                email,
                password,
                phone,
                city,
                address,
                newsletterOptIn,
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div
            className="login-page container"
            style={{
                padding: '32px 0 64px',
                maxWidth: '900px',
                margin: '0 auto'
            }}
        >
            <div>
                <h1
                    style={{
                        textAlign: 'left',
                        marginBottom: '24px',
                        fontSize: '30px',
                        fontWeight: '800'
                    }}
                >
                    Create your account
                </h1>

                {error && (
                    <div
                        style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}
                    >
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: '20px',
                        alignItems: 'flex-start'
                    }}
                >
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Mobile Number</label>
                        <input
                            type="tel"
                            placeholder="e.g. 07xx xxx xxx"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>City / Town</label>
                        <input
                            type="text"
                            placeholder="Where do you live?"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                            required
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Delivery Address (optional)</label>
                        <textarea
                            placeholder="Estate / Building, Street, House or Apartment, any delivery notes"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', minHeight: '70px', resize: 'vertical' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                            required
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                        <input
                            id="newsletter"
                            type="checkbox"
                            checked={newsletterOptIn}
                            onChange={(e) => setNewsletterOptIn(e.target.checked)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <label htmlFor="newsletter" style={{ cursor: 'pointer', color: '#555' }}>
                            Keep me updated about new products, deals and offers.
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            gridColumn: '1 / -1',
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#E41E26',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        REGISTER
                    </button>
                </form>

                <div style={{ marginTop: '24px', fontSize: '14px', color: '#666' }}>
                    Have an Account? <Link to={`/login?redirect=${redirect}`} style={{ color: '#E41E26', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
