import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/summary`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setAnalytics(data);
                } else {
                    setError(data.message || 'Failed to fetch analytics');
                }
            } catch (err) {
                setError('Something went wrong. Could not load dashboard analytics.');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.isAdmin) {
            fetchAnalytics();
        }
    }, [user]);

    if (loading)
        return (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#6b7280' }}>
                <div className="loading-spinner large"></div>
                <p style={{ marginTop: '16px', fontSize: '14px' }}>Loading dashboard...</p>
            </div>
        );
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!analytics) return null;

    return (
        <div>
            <h1 style={{ fontSize: '28px', marginBottom: '30px', color: '#333' }}>Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #3b82f6' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Users</h3>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{analytics.totalUsers}</p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Orders</h3>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{analytics.totalOrders}</p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Products</h3>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{analytics.products}</p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #e41e26' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Sales</h3>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>KSh {analytics.totalSales.toLocaleString()}</p>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#333' }}>Recent Orders</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>ID</th>
                                <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>USER</th>
                                <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>DATE</th>
                                <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>TOTAL</th>
                                <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>PAID</th>
                                <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>DELIVERED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.recentOrders.map((order) => (
                                <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>{order._id.substring(0, 10)}...</td>
                                    <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>{order.user && order.user.name}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>{order.createdAt.substring(0, 10)}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>KSh {order.totalPrice.toLocaleString()}</td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>
                                        {order.isPaid ? (
                                            <span style={{ color: '#10b981', backgroundColor: '#d1fae5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Yes</span>
                                        ) : (
                                            <span style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>No</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>
                                        {order.isDelivered ? (
                                            <span style={{ color: '#10b981', backgroundColor: '#d1fae5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Yes</span>
                                        ) : (
                                            <span style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>No</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
