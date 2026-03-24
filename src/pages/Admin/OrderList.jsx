import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/apiClient';

const OrderList = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [minTotal, setMinTotal] = useState('');
    const [maxTotal, setMaxTotal] = useState('');

    // Bulk selection
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [bulkStatus, setBulkStatus] = useState('');
    const [bulkUpdating, setBulkUpdating] = useState(false);

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

    const paymentOptions = [
        { value: '', label: 'All methods' },
        { value: 'M-Pesa', label: 'M-Pesa' },
        { value: 'CreditCard', label: 'Credit Card' },
    ];

    const buildQueryString = () => {
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter);
        if (emailFilter) params.set('email', emailFilter.trim());
        if (paymentMethodFilter) params.set('paymentMethod', paymentMethodFilter);
        if (dateFrom) params.set('from', dateFrom);
        if (dateTo) params.set('to', dateTo);
        if (minTotal) params.set('minTotal', minTotal);
        if (maxTotal) params.set('maxTotal', maxTotal);
        const query = params.toString();
        return query ? `?${query}` : '';
    };

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const query = buildQueryString();
            const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/orders${query}`);
            setOrders(data);
            setSelectedOrderIds([]);
        } catch (err) {
            setError(err.message || 'Something went wrong. Could not load orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const updatedOrder = await apiFetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            setOrders((prev) =>
                prev.map((order) => (order._id === orderId ? { ...order, ...updatedOrder } : order))
            );
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to update order status');
        }
    };

    const toggleSelectOrder = (orderId) => {
        setSelectedOrderIds((prev) =>
            prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedOrderIds.length === orders.length) {
            setSelectedOrderIds([]);
        } else {
            setSelectedOrderIds(orders.map((o) => o._id));
        }
    };

    const handleBulkUpdateStatus = async () => {
        if (!bulkStatus || selectedOrderIds.length === 0) return;

        if (!window.confirm(`Update ${selectedOrderIds.length} orders to "${bulkStatus}"?`)) {
            return;
        }

        setBulkUpdating(true);
        setError('');
        try {
            const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/orders/bulk/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderIds: selectedOrderIds, status: bulkStatus }),
            });

            const updatedOrders = data.orders || [];
            setOrders((prev) =>
                prev.map((order) => {
                    const updated = updatedOrders.find((o) => o._id === order._id);
                    return updated ? { ...order, ...updated } : order;
                })
            );
            setSelectedOrderIds([]);
            setBulkStatus('');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to bulk update orders');
        } finally {
            setBulkUpdating(false);
        }
    };

    const handleExportCsv = () => {
        const query = buildQueryString();
        const url = `${import.meta.env.VITE_API_URL}/api/orders/export${query}`;
        window.open(url, '_blank');
    };

    if (loading)
        return (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#6b7280' }}>
                <div className="loading-spinner large"></div>
                <p style={{ marginTop: '16px', fontSize: '14px' }}>Loading orders...</p>
            </div>
        );
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    const allSelected = orders.length > 0 && selectedOrderIds.length === orders.length;

    return (
        <div>
            <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>Orders</h1>

            {/* Filters */}
            <div
                style={{
                    marginBottom: '16px',
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '12px',
                    alignItems: 'flex-end',
                }}
            >
                <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                    >
                        <option value="">All statuses</option>
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Customer email</label>
                    <input
                        type="text"
                        placeholder="Search by email"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Payment method</label>
                    <select
                        value={paymentMethodFilter}
                        onChange={(e) => setPaymentMethodFilter(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                    >
                        {paymentOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>From date</label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>To date</label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Min total (KSh)</label>
                    <input
                        type="number"
                        value={minTotal}
                        onChange={(e) => setMinTotal(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Max total (KSh)</label>
                    <input
                        type="number"
                        value={maxTotal}
                        onChange={(e) => setMaxTotal(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={fetchOrders}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#111827',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Apply filters
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setStatusFilter('');
                            setEmailFilter('');
                            setPaymentMethodFilter('');
                            setDateFrom('');
                            setDateTo('');
                            setMinTotal('');
                            setMaxTotal('');
                            fetchOrders();
                        }}
                        style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'white',
                            color: '#4b5563',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleExportCsv}
                        style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#f9fafb',
                            color: '#111827',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Bulk actions */}
            <div
                style={{
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                    color: '#4b5563',
                }}
            >
                <div>
                    {selectedOrderIds.length > 0 ? (
                        <span>
                            {selectedOrderIds.length} selected
                        </span>
                    ) : (
                        <span>{orders.length} orders</span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Bulk status:</span>
                    <select
                        value={bulkStatus}
                        onChange={(e) => setBulkStatus(e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                    >
                        <option value="">Choose status</option>
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        disabled={!bulkStatus || selectedOrderIds.length === 0 || bulkUpdating}
                        onClick={handleBulkUpdateStatus}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor:
                                !bulkStatus || selectedOrderIds.length === 0 || bulkUpdating
                                    ? '#e5e7eb'
                                    : '#E41E26',
                            color:
                                !bulkStatus || selectedOrderIds.length === 0 || bulkUpdating
                                    ? '#9ca3af'
                                    : '#ffffff',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor:
                                !bulkStatus || selectedOrderIds.length === 0 || bulkUpdating
                                    ? 'not-allowed'
                                    : 'pointer',
                        }}
                    >
                        {bulkUpdating ? 'Updating...' : 'Apply'}
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>ID</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>USER</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>DATE</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>TOTAL</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>PAID</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>DELIVERED</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>STATUS</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}>PAYMENT</th>
                            <th style={{ padding: '12px', color: '#666', fontSize: '14px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const isSelected = selectedOrderIds.includes(order._id);
                            return (
                                <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelectOrder(order._id)}
                                        />
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>{order._id}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>
                                        {order.user && (order.user.name || order.user.email)}
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>
                                        {order.createdAt ? order.createdAt.substring(0, 10) : ''}
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>
                                        KSh {order.totalPrice.toLocaleString()}
                                    </td>
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
                                    <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>
                                        {order.paymentMethod || '-'}
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right' }}>
                                        <Link
                                            to={`/admin/order/${order._id}`}
                                            style={{
                                                backgroundColor: '#f3f4f6',
                                                color: '#374151',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                textDecoration: 'none',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;
