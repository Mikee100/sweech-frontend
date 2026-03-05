import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OrderList = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                } else {
                    setError(data.message || 'Failed to fetch orders');
                }
            } catch (err) {
                setError('Something went wrong. Could not load orders.');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.isAdmin) {
            fetchOrders();
        }
    }, [user]);

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'processing', label: 'Processing' },
        { value: 'dispatched', label: 'Dispatched' },
        { value: 'in_transit', label: 'In transit' },
        { value: 'out_for_delivery', label: 'Out for delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update status');
            }

            const updatedOrder = await response.json();

            setOrders((prev) =>
                prev.map((order) => (order._id === orderId ? { ...order, ...updatedOrder } : order))
            );
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to update order status');
        }
    };

    if (loading)
        return (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#6b7280' }}>
                <div className="loading-spinner large"></div>
                <p style={{ marginTop: '16px', fontSize: '14px' }}>Loading orders...</p>
            </div>
        );
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h1 style={{ fontSize: '28px', marginBottom: '30px', color: '#333' }}>Orders</h1>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>ID</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>USER</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>DATE</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>TOTAL</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>PAID</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>DELIVERED</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>STATUS</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>{order._id}</td>
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
                                <td style={{ padding: '12px', fontSize: '14px' }}>
                                    <select
                                        value={order.status || 'pending'}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        style={{
                                            padding: '6px 8px',
                                            borderRadius: '6px',
                                            border: '1px solid #e5e7eb',
                                            fontSize: '12px',
                                            backgroundColor: '#f9fafb',
                                        }}
                                    >
                                        {statusOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right' }}>
                                    <Link to={`/order/${order._id}`} style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: '500' }}>
                                        Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;
