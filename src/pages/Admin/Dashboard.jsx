
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/apiClient';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // Step 1: Minimal low-stock notification logic
    const lowStockProducts = analytics && analytics.lowStockProducts ? analytics.lowStockProducts : [];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/analytics/summary`);
                setAnalytics(data);
            } catch (err) {
                setError(err.message || 'Something went wrong. Could not load dashboard analytics.');
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
            <div className="dashboard-container" style={{ textAlign: 'center', color: '#6b7280' }}>
                <div className="loading-spinner large"></div>
                <p style={{ marginTop: '16px', fontSize: '14px' }}>Loading dashboard...</p>
            </div>
        );
    if (error) return <div className="dashboard-container" style={{ color: 'red' }}>{error}</div>;
    if (!analytics) return null;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            {/* Low-stock notification (always visible) */}
            <div className="low-stock-alert">
                {lowStockProducts.length > 0 ? (
                    <>
                        <div>
                            Attention: {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's are' : ' is'} low on stock!
                        </div>
                        <ul className="low-stock-list">
                            {lowStockProducts.map((p, idx) => (
                                <li key={p._id + (p.variantSku || '')} className="low-stock-item">
                                    <a
                                        href={p.isVariant
                                            ? `/admin/products/${p.slug}/edit?variant=${encodeURIComponent(p.variantSku || '')}`
                                            : `/admin/products/${p.slug}/edit`}
                                        className="low-stock-link"
                                        style={{ textDecoration: 'underline', color: '#2563eb', fontWeight: 500 }}
                                    >
                                        {p.name}
                                    </a>
                                    {p.isVariant && (
                                        <span style={{ marginLeft: 6, color: '#555', fontSize: 13 }}>
                                            {p.variantColor && <span>Color: {p.variantColor} </span>}
                                            {p.variantStyle && <span>Style: {p.variantStyle} </span>}
                                            {p.variantLabel && <span>Label: {p.variantLabel} </span>}
                                            {p.variantSku && <span>SKU: {p.variantSku}</span>}
                                        </span>
                                    )}
                                    <span style={{ marginLeft: 10, color: '#b91c1c', fontWeight: 500 }}>
                                        (Stock: {p.stock})
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <div>No products are currently low on stock.</div>
                )}
            </div>

            <div className="dashboard-stats">
                <div className="dashboard-stat users">
                    <h3 className="dashboard-stat-title">Total Users</h3>
                    <p className="dashboard-stat-value">{analytics.totalUsers}</p>
                </div>
                <div className="dashboard-stat orders">
                    <h3 className="dashboard-stat-title">Total Orders</h3>
                    <p className="dashboard-stat-value">{analytics.totalOrders}</p>
                </div>
                <div className="dashboard-stat products">
                    <h3 className="dashboard-stat-title">Total Products</h3>
                    <p className="dashboard-stat-value">{analytics.products}</p>
                </div>
                <div className="dashboard-stat sales">
                    <h3 className="dashboard-stat-title">Total Sales</h3>
                    <p className="dashboard-stat-value">KSh {analytics.totalSales.toLocaleString()}</p>
                </div>
            </div>

            <div className="dashboard-orders">
                <h2 className="dashboard-orders-title">Recent Orders</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table className="dashboard-orders-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>USER</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.recentOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id.substring(0, 10)}...</td>
                                    <td>{order.user && order.user.name}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>KSh {order.totalPrice.toLocaleString()}</td>
                                    <td>
                                        {order.isPaid ? (
                                            <span className="dashboard-badge paid">Yes</span>
                                        ) : (
                                            <span className="dashboard-badge unpaid">No</span>
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            <span className="dashboard-badge delivered">Yes</span>
                                        ) : (
                                            <span className="dashboard-badge undelivered">No</span>
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
