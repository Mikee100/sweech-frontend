import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLE_OPTIONS = [
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'SUPPORT', label: 'Support' },
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
];

const UserEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [role, setRole] = useState('CUSTOMER');
    const [notes, setNotes] = useState('');
    const [tagsText, setTagsText] = useState('');

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    setName(data.name);
                    setEmail(data.email);
                    setIsAdmin(Boolean(data.isAdmin));
                    const effectiveRole = data.role || (data.isAdmin ? 'MANAGER' : 'CUSTOMER');
                    setRole(effectiveRole);
                    setNotes(data.notes || '');
                    setTagsText((data.tags || []).join(', '));
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

    useEffect(() => {
        const fetchOrders = async () => {
            if (!email || !user || !user.isAdmin) return;
            setOrdersLoading(true);
            setOrdersError('');
            try {
                const params = new URLSearchParams({ email });
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders?${params.toString()}`, {
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                } else {
                    setOrdersError(data.message || 'Failed to load orders for this user.');
                }
            } catch (err) {
                setOrdersError('Something went wrong while loading orders.');
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchOrders();
    }, [email, user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');

        const tags = tagsText
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

        // Keep isAdmin in sync with role on submit
        let nextIsAdmin = isAdmin;
        if (role === 'CUSTOMER') {
            nextIsAdmin = false;
        } else if (!isAdmin) {
            nextIsAdmin = true;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, email, isAdmin: nextIsAdmin, role, notes, tags })
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

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
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

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
                        >
                            {ROLE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <p style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>
                            Any role other than Customer will be treated as an admin for protected routes.
                        </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            <span style={{ color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>Is Admin (legacy flag)</span>
                        </label>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>Internal notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="VIP customer, often orders on weekends, etc."
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', minHeight: '80px', fontSize: '14px', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tagsText}
                            onChange={(e) => setTagsText(e.target.value)}
                            placeholder="e.g. VIP, High risk, B2B"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        />
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

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#111827' }}>Recent Orders</h2>
                    {ordersLoading && (
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>Loading orders...</p>
                    )}
                    {ordersError && (
                        <p style={{ fontSize: '13px', color: '#dc2626' }}>{ordersError}</p>
                    )}
                    {!ordersLoading && !ordersError && orders.length === 0 && (
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>No orders found for this user.</p>
                    )}
                    {!ordersLoading && !ordersError && orders.length > 0 && (
                        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <th style={{ textAlign: 'left', padding: '6px 4px', color: '#6b7280' }}>Order</th>
                                        <th style={{ textAlign: 'left', padding: '6px 4px', color: '#6b7280' }}>Date</th>
                                        <th style={{ textAlign: 'left', padding: '6px 4px', color: '#6b7280' }}>Total</th>
                                        <th style={{ textAlign: 'left', padding: '6px 4px', color: '#6b7280' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 20).map((order) => (
                                        <tr key={order._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '6px 4px' }}>
                                                <Link to={`/order/${order._id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                                                    #{order._id.slice(-8)}
                                                </Link>
                                            </td>
                                            <td style={{ padding: '6px 4px', color: '#374151' }}>
                                                {order.createdAt ? order.createdAt.substring(0, 10) : '-'}
                                            </td>
                                            <td style={{ padding: '6px 4px', color: '#111827' }}>
                                                KSh {order.totalPrice != null ? order.totalPrice.toLocaleString() : '0'}
                                            </td>
                                            <td style={{ padding: '6px 4px', color: '#4b5563' }}>
                                                {order.status || (order.isDelivered ? 'delivered' : order.isPaid ? 'processing' : 'pending')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {orders.length > 20 && (
                                <p style={{ marginTop: '8px', fontSize: '11px', color: '#6b7280' }}>
                                    Showing latest 20 orders.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserEdit;
