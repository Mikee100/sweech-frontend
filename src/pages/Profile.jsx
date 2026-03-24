import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/profile');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [address, setAddress] = useState(user.address || '');
    const [city, setCity] = useState(user.city || '');
    const [postalCode, setPostalCode] = useState(user.postalCode || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const firstName = user.name ? user.name.split(' ')[0] : 'there';
    const roleLabel = user.role ? user.role : 'Customer';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (password && password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name,
                email,
                phone,
                address,
                city,
                postalCode
            };
            if (password) {
                payload.password = password;
            }
            await updateProfile(payload);
            setStatus({ type: 'success', message: 'Profile updated successfully.' });
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setStatus({ type: 'error', message: err.message || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-page">
            <div className="container">
                <header className="account-header">
                    <p className="account-eyebrow">Account</p>
                    <div className="account-title-row">
                        <h1 className="account-title">My Account</h1>
                        <span className="account-chip">{roleLabel}</span>
                    </div>
                    <p className="account-subtitle">
                        Manage your CaseProz profile, track your orders, and quickly jump to your favourite sections.
                    </p>
                </header>

                <div className="account-layout">
                    <section className="account-card">
                        <h2 className="account-card-title">Profile details</h2>
                        <form className="account-fields" onSubmit={handleSubmit}>
                            <div className="profile-section-header">
                                <h3 className="profile-section-title">Personal Information</h3>
                            </div>
                            <div className="profile-grid">
                                <div>
                                    <label className="account-label">Full name</label>
                                    <div className="account-value">
                                        <input
                                            className="account-input"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="account-label">Email address</label>
                                    <div className="account-value">
                                        <input
                                            className="account-input"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="profile-section-header" style={{ marginTop: '24px' }}>
                                <h3 className="profile-section-title">Shipping Information</h3>
                                <p className="profile-section-subtitle">Saved for faster checkout</p>
                            </div>
                            <div className="profile-grid">
                                <div>
                                    <label className="account-label">Phone number</label>
                                    <div className="account-value">
                                        <input
                                            className="account-input"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="e.g. 07xx xxx xxx"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="account-label">City</label>
                                    <div className="account-value">
                                        <input
                                            className="account-input"
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="Your city"
                                        />
                                    </div>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="account-label">Address</label>
                                    <div className="account-value">
                                        <input
                                            className="account-input"
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Apartment, suite, unit, etc."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="account-label">Postal Code</label>
                                    <div className="account-value">
                                        <input
                                            className="account-input"
                                            type="text"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            placeholder="e.g. 00100"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="account-label">Country</label>
                                    <div className="account-value">
                                        <input
                                            className="account-input"
                                            type="text"
                                            value="Kenya"
                                            readOnly
                                            disabled
                                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="profile-section-header" style={{ marginTop: '24px' }}>
                                <h3 className="profile-section-title">Change Password</h3>
                            </div>
                            <div className="profile-grid">
                                <div>
                                    <label className="account-label">New password</label>
                                    <div className="account-value">
                                        <input
                                            className="account-input"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Leave blank to keep current"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="account-label">Confirm password</label>
                                    <div className="account-value">
                                        <input
                                            className="account-input"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="account-actions" style={{ marginTop: '32px' }}>
                                <button type="submit" className="account-save-btn" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save all changes'}
                                </button>
                                {status.message && (
                                    <span
                                        className={`account-status ${status.type === 'success' ? 'success' : status.type === 'error' ? 'error' : ''}`}
                                    >
                                        {status.message}
                                    </span>
                                )}
                            </div>
                        </form>
                    </section>

                    <aside className="account-sidebar">
                        <div className="sidebar-user-card">
                            <div className="sidebar-avatar">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="sidebar-user-info">
                                <h3 className="sidebar-username">{firstName}</h3>
                                <p className="sidebar-useremail">{user.email}</p>
                            </div>
                        </div>

                        <nav className="sidebar-menu">
                            <p className="sidebar-menu-label">Navigation</p>
                            <Link to="/orders" className="sidebar-menu-item">
                                <i className="fas fa-shopping-bag" />
                                <span>My Orders</span>
                                <i className="fas fa-chevron-right ml-auto" />
                            </Link>
                            <Link to="/favourites" className="sidebar-menu-item">
                                <i className="fas fa-heart" />
                                <span>Favourites</span>
                                <i className="fas fa-chevron-right ml-auto" />
                            </Link>
                            <div className="sidebar-menu-item disabled">
                                <i className="fas fa-map-marker-alt" />
                                <span>My Addresses</span>
                                <span className="badge-soon">Soon</span>
                            </div>
                            <div className="sidebar-menu-item disabled">
                                <i className="fas fa-shield-alt" />
                                <span>Security</span>
                                <span className="badge-soon">Soon</span>
                            </div>
                        </nav>

                        <div className="sidebar-footer">
                            <p className="sidebar-footer-label">Connect with us</p>
                            <div className="sidebar-social-links">
                                <a href="https://instagram.com/caseproz" target="_blank" rel="noreferrer" className="social-link-icon">
                                    <i className="fab fa-instagram" />
                                </a>
                                <a href="https://facebook.com/caseproz" target="_blank" rel="noreferrer" className="social-link-icon">
                                    <i className="fab fa-facebook-f" />
                                </a>
                                <a href="https://twitter.com/caseproz" target="_blank" rel="noreferrer" className="social-link-icon">
                                    <i className="fab fa-twitter" />
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Profile;

