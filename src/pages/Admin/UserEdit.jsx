import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setName(data.name);
                    setEmail(data.email);
                    setIsAdmin(data.isAdmin);
                } else {
                    setError(data.message || 'Failed to fetch user Details');
                }
            } catch (err) {
                setError('Something went wrong. Could not load user.');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.isAdmin) {
            fetchUser();
        }
    }, [id, user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ name, email, isAdmin })
            });
            const data = await response.json();

            if (response.ok) {
                navigate('/admin/userlist');
            } else {
                setError(data.message || 'Failed to update user');
            }
        } catch (err) {
            setError('Something went wrong while updating user.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading)
        return (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#6b7280' }}>
                <div className="loading-spinner large"></div>
                <p style={{ marginTop: '16px', fontSize: '14px' }}>Loading user data...</p>
            </div>
        );

    return (
        <div>
            <Link to="/admin/userlist" style={{ display: 'inline-block', marginBottom: '20px', color: '#666', textDecoration: 'none' }}>
                <i className="fas fa-arrow-left"></i> Go Back
            </Link>

            <h1 style={{ fontSize: '28px', marginBottom: '30px', color: '#333' }}>Edit User</h1>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
                {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={submitHandler}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            <span style={{ color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>Is Admin</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={updating}
                        style={{ width: '100%', padding: '12px', backgroundColor: '#E41E26', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: updating ? 'not-allowed' : 'pointer', opacity: updating ? 0.7 : 1 }}
                    >
                        {updating ? 'Updating...' : 'Update User'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserEdit;
