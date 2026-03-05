import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/orders');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                } else {
                    setError(data.message || 'Failed to fetch orders');
                }
            } catch (err) {
                setError('Something went wrong while fetching your orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const getStatusInfo = (order) => {
        // Fallback for older orders without an explicit status
        const rawStatus = order.status || (order.isDelivered ? 'delivered' : order.isPaid ? 'processing' : 'pending');

        switch (rawStatus) {
            case 'confirmed':
                return {
                    label: 'Confirmed',
                    bg: '#e0f2fe',
                    fg: '#075985',
                };
            case 'processing':
                return {
                    label: 'Processing',
                    bg: '#e0f2fe',
                    fg: '#075985',
                };
            case 'dispatched':
                return {
                    label: 'Dispatched',
                    bg: '#eef2ff',
                    fg: '#3730a3',
                };
            case 'in_transit':
                return {
                    label: 'In transit',
                    bg: '#eff6ff',
                    fg: '#1d4ed8',
                };
            case 'out_for_delivery':
                return {
                    label: 'Out for delivery',
                    bg: '#dcfce7',
                    fg: '#166534',
                };
            case 'delivered':
                return {
                    label: 'Delivered',
                    bg: '#dcfce7',
                    fg: '#166534',
                };
            case 'cancelled':
                return {
                    label: 'Cancelled',
                    bg: '#fee2e2',
                    fg: '#b91c1c',
                };
            case 'pending':
            default:
                return {
                    label: 'Pending confirmation',
                    bg: '#fef3c7',
                    fg: '#92400e',
                };
        }
    };

    return (
        <div className="container" style={{ padding: '60px 0', maxWidth: '1100px' }}>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
                <div>
                    <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', marginBottom: '8px' }}>
                        Orders
                    </p>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>My Orders</h1>
                    <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '14px' }}>
                        View a history of your purchases and track current orders.
                    </p>
                </div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                    Signed in as <span style={{ fontWeight: 600, color: '#4b5563' }}>{user.email}</span>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
                    <div className="loading-spinner large"></div>
                    <p style={{ marginTop: '16px' }}>Loading your orders...</p>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#dc2626', fontSize: '14px' }}>
                    {error}
                </div>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <div style={{ fontSize: '52px', color: '#e5e7eb', marginBottom: '16px' }}>
                        <i className="fas fa-box-open"></i>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>You haven&apos;t placed any orders yet</h3>
                    <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
                        When you do, all your orders will appear here for easy tracking.
                    </p>
                    <Link to="/" className="btn-primary">START SHOPPING</Link>
                </div>
            ) : (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af' }}>
                        <span>Order</span>
                        <span>Date</span>
                        <span>Total</span>
                        <span>Status</span>
                        <span></span>
                    </div>
                    <div>
                        {orders
                            .slice()
                            .reverse()
                            .map((order) => (
                                <div
                                    key={order._id}
                                    style={{
                                        padding: '18px 24px',
                                        borderBottom: '1px solid #f3f4f6',
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontWeight: 600, color: '#111827' }}>#{order._id.slice(-8)}</span>
                                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                                            {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <span style={{ color: '#4b5563' }}>
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                                    </span>
                                    <span style={{ fontWeight: 600, color: '#111827' }}>
                                        KSh {order.totalPrice.toLocaleString()}
                                    </span>
                                    <span>
                                        {(() => {
                                            const statusInfo = getStatusInfo(order);
                                            return (
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '4px 10px',
                                                        borderRadius: '999px',
                                                        fontSize: '12px',
                                                        backgroundColor: statusInfo.bg,
                                                        color: statusInfo.fg,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '999px',
                                                            backgroundColor: 'currentColor',
                                                        }}
                                                    ></span>
                                                    {statusInfo.label}
                                                </span>
                                            );
                                        })()}
                                    </span>
                                    <div style={{ textAlign: 'right' }}>
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="btn-primary"
                                            style={{
                                                padding: '8px 14px',
                                                fontSize: '12px',
                                                borderRadius: '999px',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;

