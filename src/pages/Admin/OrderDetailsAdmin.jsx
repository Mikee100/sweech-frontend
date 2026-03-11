import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OrderDetailsAdmin = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
                    credentials: 'include'
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

        if (user && user.isAdmin) {
            fetchOrder();
        }
    }, [id, user]);

    if (loading)
        return (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <div className="loading-spinner large"></div>
                <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '14px' }}>Loading order...</p>
            </div>
        );
    if (error) return <div style={{ padding: '80px 0', textAlign: 'center', color: '#dc2626' }}>{error}</div>;
    if (!order) return null;

    const rawStatus = order.status || (order.isDelivered ? 'delivered' : order.isPaid ? 'processing' : 'pending');

    const statusSteps = [
        { id: 'pending', label: 'Order placed' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'processing', label: 'Processing' },
        { id: 'dispatched', label: 'Dispatched' },
        { id: 'in_transit', label: 'In transit' },
        { id: 'out_for_delivery', label: 'Out for delivery' },
        { id: 'delivered', label: 'Delivered' },
    ];

    const statusOrder = statusSteps.map((step) => step.id);
    const currentIndex = statusOrder.indexOf(rawStatus);

    const formatStatusLabel = (status) => {
        const found = statusSteps.find((s) => s.id === status);
        if (found) return found.label;
        if (status === 'cancelled') return 'Cancelled';
        return 'Pending confirmation';
    };

    return (
        <div style={{ padding: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link to="/admin/orderlist" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '13px' }}>
                        &larr; Back to orders
                    </Link>
                    <span style={{ fontWeight: 'bold' }}>Order #{order._id}</span>
                </div>
                <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: 'white',
                        color: '#111827',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    <i className="fas fa-print"></i>
                    Print / Save as PDF
                </button>
            </div>

            <div style={{ marginBottom: '24px', backgroundColor: '#f9fafb', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>Order status</h2>
                <p style={{ color: '#666', margin: '0 0 12px 0', fontSize: '14px' }}>
                    Current status:{' '}
                    <span style={{ fontWeight: 600 }}>{formatStatusLabel(rawStatus)}</span>
                </p>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: '#6b7280' }}>
                        <span>Order timeline</span>
                        {order.trackingNumber && (
                            <span>
                                Tracking:&nbsp;
                                <strong>{order.trackingNumber}</strong>
                                {order.carrier && (
                                    <>
                                        {' '}via <strong>{order.carrier}</strong>
                                    </>
                                )}
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', overflowX: 'auto', paddingTop: '4px' }}>
                        {statusSteps.map((step, index) => {
                            const isCompleted = currentIndex === -1 ? index === 0 : index <= currentIndex;
                            const isActive = currentIndex === index || (currentIndex === -1 && index === 0);

                            return (
                                <div key={step.id} style={{ display: 'flex', alignItems: 'center', minWidth: index === statusSteps.length - 1 ? 'auto' : '0' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px',
                                            minWidth: '80px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 18,
                                                height: 18,
                                                borderRadius: '999px',
                                                border: isCompleted ? 'none' : '2px solid #e5e7eb',
                                                backgroundColor: isCompleted ? '#E41E26' : '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: '10px',
                                                boxShadow: isActive ? '0 0 0 4px rgba(220, 38, 38, 0.08)' : 'none',
                                            }}
                                        >
                                            {isCompleted ? <i className="fas fa-check" style={{ fontSize: '9px' }}></i> : ''}
                                        </div>
                                        <span
                                            style={{
                                                fontSize: '11px',
                                                color: isCompleted ? '#b91c1c' : '#9ca3af',
                                                textAlign: 'center',
                                                maxWidth: 80,
                                            }}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                    {index < statusSteps.length - 1 && (
                                        <div
                                            style={{
                                                flex: 1,
                                                height: 2,
                                                background: `linear-gradient(to right, ${
                                                    index < currentIndex || currentIndex === -1
                                                        ? '#E41E26'
                                                        : '#e5e7eb'
                                                } , #e5e7eb)`,
                                                margin: '0 4px',
                                                minWidth: 24,
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>Customer & Delivery</h3>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>Name:</strong> {order.user.name}</p>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>Email:</strong> {order.user.email}</p>
                        <p style={{ margin: '12px 0 5px 0', fontSize: '14px' }}><strong>Shipping Address:</strong></p>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                            {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        <p style={{ marginTop: '12px', fontSize: '13px', color: '#6b7280' }}>
                            <strong>Placed:</strong>{' '}
                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
                        </p>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>Order Items</h3>
                        {order.orderItems.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    marginBottom: '16px',
                                    paddingBottom: '16px',
                                    borderBottom: index === order.orderItems.length - 1 ? 'none' : '1px solid #f3f4f6',
                                }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: '70px', height: '70px', objectFit: 'contain', backgroundColor: '#f9fafb', borderRadius: '8px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 6px 0', fontSize: '14px' }}>{item.name}</h4>
                                    <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>
                                        {item.qty} x KSh {item.price.toLocaleString()} ={' '}
                                        <strong>KSh {(item.qty * item.price).toLocaleString()}</strong>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', position: 'sticky', top: '80px' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid #f3f4f6', paddingBottom: '10px' }}>Order Summary</h3>
                        <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6b7280' }}>Items Total:</span>
                                <span>KSh {order.itemsPrice.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6b7280' }}>Shipping:</span>
                                <span>KSh {order.shippingPrice.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6b7280' }}>Tax:</span>
                                <span>KSh {order.taxPrice.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#E41E26', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                                <span>Total:</span>
                                <span>KSh {order.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '18px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '13px' }}>
                            <p style={{ margin: '0 0 8px 0' }}>
                                <strong>Payment Method:</strong> {order.paymentMethod}
                            </p>
                            <p style={{ margin: 0 }}>
                                <strong>Order status:</strong>{' '}
                                <span style={{ color: rawStatus === 'cancelled' ? '#b91c1c' : '#16a34a' }}>
                                    {formatStatusLabel(rawStatus)}
                                </span>
                            </p>
                            <p style={{ marginTop: '8px', color: '#6b7280' }}>
                                <strong>Paid:</strong>{' '}
                                {order.isPaid
                                    ? `Yes (${order.paidAt ? new Date(order.paidAt).toLocaleString() : ''})`
                                    : 'No'}
                            </p>
                            <p style={{ marginTop: '4px', color: '#6b7280' }}>
                                <strong>Delivered:</strong>{' '}
                                {order.isDelivered
                                    ? `Yes (${order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : ''})`
                                    : 'No'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsAdmin;

