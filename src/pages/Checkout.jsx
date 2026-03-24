import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SHIPPING_ZONES } from '../constants/shippingZones';
import { useSiteConfig } from '../context/SiteConfigContext';
import { apiFetch, ApiError } from '../utils/apiClient';
import ErrorBanner from '../components/ErrorBanner';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { config } = useSiteConfig();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [city, setCity] = useState(user?.city || '');
    const [postalCode, setPostalCode] = useState(user?.postalCode || '');
    const [country, setCountry] = useState(user?.country || 'Kenya');
    const [paymentMethod, setPaymentMethod] = useState('M-Pesa');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [selectedZoneId] = useState(() => {
        const stored = localStorage.getItem('shippingZoneId');
        return stored || SHIPPING_ZONES[0].id;
    });

    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountMessage, setDiscountMessage] = useState('');
    const [applyingDiscount, setApplyingDiscount] = useState(false);

    const selectedZone =
        SHIPPING_ZONES.find((zone) => zone.id === selectedZoneId) || SHIPPING_ZONES[0];

    const taxRate = typeof config?.taxRate === 'number' ? config.taxRate : 0.16;
    const shippingPrice = selectedZone.price;
    const taxPrice = cartTotal * taxRate;
    const subtotalBeforeDiscount = cartTotal;
    const totalPrice = subtotalBeforeDiscount + shippingPrice + taxPrice - discountAmount;

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/checkout');
        }
        if (cart.length === 0) {
            navigate('/');
        }
    }, [user, navigate, cart]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Frontend validation to ensure required fields are filled
        if (!fullName.trim()) {
            const message = 'Please enter the recipient name.';
            setError(message);
            setLoading(false);
            return;
        }

        const phoneNormalized = phone.replace(/\s+/g, '');
        if (!phoneNormalized || phoneNormalized.length < 9) {
            const message = 'Please enter a valid phone number for delivery updates.';
            setError(message);
            setLoading(false);
            return;
        }

        if (!address.trim() || !city.trim() || !postalCode.trim() || !country.trim()) {
            const message = 'Please fill in your full shipping address before placing the order.';
            setError(message);
            setLoading(false);
            return;
        }

        if (!termsAccepted) {
            const message = 'Please confirm that you agree to the terms before placing the order.';
            setError(message);
            setLoading(false);
            return;
        }

        const orderData = {
            orderItems: cart.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.images[0],
                price: item.price,
                product: item._id
            })),
            shippingAddress: { name: fullName, phone: phoneNormalized, address, city, postalCode, country },
            paymentMethod,
            itemsPrice: cartTotal,
            shippingPrice,
            taxPrice,
            totalPrice,
            discountCode: discountAmount > 0 ? discountCode.trim() || null : null,
            discountAmount
        };

        try {
            const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            clearCart();
            const message = 'Order placed successfully! Redirecting to your order...';
            setSuccess(message);
            setTimeout(() => {
                navigate(`/order/${data._id}`);
            }, 1200);
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 401) {
                    setError('Your session has expired. Please log in again to place your order.');
                } else if (err.status === 400) {
                    setError(err.message || 'Please review your details and try again.');
                } else {
                    setError(err.message);
                }
            } else {
                setError('Something went wrong while placing your order. Please check your connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApplyDiscount = async () => {
        const code = discountCode.trim();
        if (!code) {
            setDiscountMessage('Enter a code to apply.');
            return;
        }
        setApplyingDiscount(true);
        setDiscountMessage('');
        setError('');
        try {
            const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/discounts/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                    itemsTotal: cartTotal,
                }),
            });
            setDiscountAmount(data.discountAmount || 0);
            setDiscountMessage(data.message || 'Discount code applied.');
        } catch (err) {
            setDiscountAmount(0);
            setDiscountMessage('');
            if (err instanceof ApiError) {
                setError(err.message || 'Failed to apply discount code.');
            } else {
                setError('Failed to apply discount code. Please try again.');
            }
        } finally {
            setApplyingDiscount(false);
        }
    };

    if (!user || cart.length === 0) return null;

    return (
        <div className="checkout-page container" style={{ padding: '60px 0' }}>
            <h1 style={{ marginBottom: '16px', fontSize: '32px', fontWeight: 'bold' }}>Checkout</h1>
            <ErrorBanner message={error} onClose={() => setError('')} />

            <div className="checkout-layout">
                <form onSubmit={handlePlaceOrder}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Shipping Information</h2>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Full name</label>
                            <input type="text" placeholder="Enter recipient name" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Phone number</label>
                            <input type="tel" placeholder="e.g. 07xx xxx xxx" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Address</label>
                            <input type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>

                        <div className="checkout-2col" style={{ marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>City</label>
                                <input type="text" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Postal Code</label>
                                <input type="text" placeholder="Enter postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Country</label>
                            <input type="text" value={country} readOnly style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }} />
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Payment Method</h2>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input type="radio" name="payment" value="M-Pesa" checked={paymentMethod === 'M-Pesa'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                M-Pesa
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input type="radio" name="payment" value="CreditCard" checked={paymentMethod === 'CreditCard'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                Credit Card
                            </label>
                        </div>
                    </div>
                </form>

                <div className="order-summary">
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', position: 'sticky', top: '120px' }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Order Summary</h2>

                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                            {cart.map(item => (
                                <div key={item._id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f9f9f9' }}>
                                    <img src={item.images[0]} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '14px', margin: 0, fontWeight: 'bold' }}>{item.name}</p>
                                        <p style={{ fontSize: '12px', color: '#666' }}>{item.quantity} x KSh {item.price.toLocaleString()}</p>
                                    </div>
                                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>KSh {(item.quantity * item.price).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gap: '10px', marginBottom: '16px', fontSize: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>Items Subtotal:</span>
                                <span>KSh {cartTotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>Shipping ({selectedZone.label}):</span>
                                <span>{shippingPrice === 0 ? 'Pick up (Free)' : `KSh ${shippingPrice.toLocaleString()}`}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>Tax ({Math.round(taxRate * 100)}%):</span>
                                <span>KSh {taxPrice.toLocaleString()}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                                    <span>Discount</span>
                                    <span>- KSh {discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', borderTop: '1px solid #eee', paddingTop: '15px', marginTop: '10px', color: '#E41E26' }}>
                                <span>Total:</span>
                                <span>KSh {totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                                Discount code
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    placeholder="Enter promo code"
                                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyDiscount}
                                    disabled={applyingDiscount || !discountCode.trim()}
                                    style={{
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: applyingDiscount || !discountCode.trim() ? '#e5e7eb' : '#111827',
                                        color: applyingDiscount || !discountCode.trim() ? '#9ca3af' : '#ffffff',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: applyingDiscount || !discountCode.trim() ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {applyingDiscount ? 'Applying...' : 'Apply'}
                                </button>
                            </div>
                            {discountMessage && (
                                <p style={{ marginTop: '6px', fontSize: '12px', color: '#16a34a' }}>
                                    {discountMessage}
                                </p>
                            )}
                        </div>

                        {success && (
                            <div
                                style={{
                                    backgroundColor: '#ecfdf3',
                                    color: '#166534',
                                    border: '1px solid #bbf7d0',
                                    borderRadius: '8px',
                                    padding: '10px 12px',
                                    fontSize: '14px',
                                    marginBottom: '12px'
                                }}
                            >
                                {success}
                            </div>
                        )}

                        {error && (
                            <div
                                style={{
                                    backgroundColor: '#fef2f2',
                                    color: '#b91c1c',
                                    border: '1px solid #fecaca',
                                    borderRadius: '8px',
                                    padding: '10px 12px',
                                    fontSize: '14px',
                                    marginBottom: '12px'
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '14px', fontSize: '12px', color: '#374151' }}>
                            <input
                                type="checkbox"
                                id="checkout-terms"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                style={{ marginTop: '3px' }}
                            />
                            <label htmlFor="checkout-terms">
                                I confirm that I have reviewed my order details, shipping information, and understand the store&apos;s delivery and returns policy.
                            </label>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '15px',
                                backgroundColor: '#E41E26',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
