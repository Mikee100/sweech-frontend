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
            const payload = { name, email };
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
                            <div>
                                <label className="account-label">New password</label>
                                <div className="account-value">
                                    <input
                                        className="account-input"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Leave blank to keep current password"
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
                                        placeholder="Re-enter new password"
                                    />
                                </div>
                            </div>
                            <p className="account-footnote">
                                Update your basic account details. Changing your email or password will apply the next time you sign in.
                            </p>
                            <div className="account-actions">
                                <button type="submit" className="account-save-btn" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save changes'}
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

                    <aside className="account-side-card">
                        <p className="account-side-eyebrow">Overview</p>
                        <h3 className="account-side-title">Welcome back, {firstName}.</h3>
                        <p className="account-side-text">
                            You&apos;re signed in with <span style={{ color: '#e5e7eb' }}>{user.email}</span>. From here you can quickly
                            jump to your key account areas.
                        </p>
                        <div className="account-quick-grid">
                            <Link to="/orders" className="account-quick-link">
                                <div className="account-quick-item">
                                    <div className="account-quick-label">
                                        <i className="fas fa-history" />
                                        My Orders
                                    </div>
                                    <p className="account-quick-copy">View and track your recent purchases.</p>
                                </div>
                            </Link>
                            <Link to="/favourites" className="account-quick-link">
                                <div className="account-quick-item">
                                    <div className="account-quick-label">
                                        <i className="fas fa-heart" />
                                        Favourites
                                    </div>
                                    <p className="account-quick-copy">Browse items you&apos;ve saved for later.</p>
                                </div>
                            </Link>
                            <div className="account-quick-item disabled">
                                <div className="account-quick-label">
                                    <i className="fas fa-map-marker-alt" />
                                    Addresses
                                </div>
                                <p className="account-quick-copy">Saved delivery addresses coming soon.</p>
                            </div>
                            <div className="account-quick-item disabled">
                                <div className="account-quick-label">
                                    <i className="fas fa-lock" />
                                    Security
                                </div>
                                <p className="account-quick-copy">Contact support to change your password.</p>
                            </div>
                        </div>
                        <div className="account-social">
                            <span className="account-social-label">Stay connected:</span>
                            <div className="account-social-links">
                                <a
                                    href="https://www.instagram.com/caseproz/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="account-social-link"
                                >
                                    <i className="fab fa-instagram" />
                                    Instagram
                                </a>
                                <a
                                    href="https://www.facebook.com/profile.php?id=61585137213302&ref=NONE_ig_profile_ac"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="account-social-link"
                                >
                                    <i className="fab fa-facebook" />
                                    Facebook
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

