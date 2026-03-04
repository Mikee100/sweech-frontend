import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrder(data);
                } else {
                    setError(data.message || 'Failed to fetch order');
                }
            } catch (err) {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    if (loading) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading Order...</div>;
    if (error) return <div className="container" style={{ padding: '100px 0', textAlign: 'center', color: '#dc2626' }}>{error}</div>;
    if (!order) return null;

    return (
        <div className="order-details-page container" style={{ padding: '60px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                <Link to="/" style={{ color: '#E41E26', textDecoration: 'none' }}>Home</Link>
                <i className="fas fa-chevron-right" style={{ fontSize: '10px', color: '#ccc' }}></i>
                <span style={{ fontWeight: 'bold' }}>Order #{order._id}</span>
            </div>

            <div style={{ backgroundColor: '#fdf2f2', padding: '30px', borderRadius: '12px', marginBottom: '40px', border: '1px solid #fee2e2' }}>
                <h1 style={{ color: '#E41E26', fontSize: '24px', margin: '0 0 10px 0' }}>Thank you for your order!</h1>
                <p style={{ color: '#666', margin: 0 }}>Your order has been placed and is being processed.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                <div className="order-info">
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Delivery Details</h2>
                        <p style={{ margin: '0 0 5px 0' }}><strong>Name:</strong> {order.user.name}</p>
                        <p style={{ margin: '0 0 5px 0' }}><strong>Email:</strong> {order.user.email}</p>
                        <p style={{ margin: '15px 0 5px 0' }}><strong>Shipping Address:</strong></p>
                        <p style={{ margin: 0, color: '#666' }}>
                            {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Order Items</h2>
                        {order.orderItems.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '20px', marginBottom: '20px', paddingBottom: '20px', borderBottom: index === order.orderItems.length - 1 ? 'none' : '1px solid #f9f9f9' }}>
                                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: '#f9f9f9', borderRadius: '8px' }} />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{item.name}</h4>
                                    <p style={{ margin: 0, color: '#666' }}>{item.qty} x KSh {item.price.toLocaleString()} = <strong>KSh {(item.qty * item.price).toLocaleString()}</strong></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order-summary">
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', position: 'sticky', top: '100px' }}>
                        <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Order Summary</h2>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: '#666' }}>Items Total:</span>
                                <span>KSh {order.itemsPrice.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: '#666' }}>Shipping:</span>
                                <span>KSh {order.shippingPrice.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: '#666' }}>Tax:</span>
                                <span>KSh {order.taxPrice.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: '#E41E26', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                <span>Total:</span>
                                <span>KSh {order.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', fontSize: '14px' }}>
                            <p style={{ margin: '0 0 10px 0' }}><strong>Payment Method:</strong> {order.paymentMethod}</p>
                            <p style={{ margin: 0 }}><strong>Status:</strong> <span style={{ color: order.isPaid ? 'green' : 'orange' }}>{order.isPaid ? 'Paid' : 'Pending Payment'}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
