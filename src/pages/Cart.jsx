import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { SHIPPING_ZONES } from '../constants/shippingZones';

const Cart = () => {
    const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [discount, setDiscount] = useState(0);
    const [recommendations, setRecommendations] = useState([]);
    const [selectedZoneId, setSelectedZoneId] = useState(() => {
        const stored = localStorage.getItem('shippingZoneId');
        return stored || SHIPPING_ZONES[0].id;
    });

    // Simple sample coupon: SWECH10 = 10% off items subtotal
    const handleApplyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        setCouponError('');
        setCouponSuccess('');

        if (!code) {
            const message = 'Please enter a coupon code.';
            setCouponError(message);
            return;
        }

        if (code === 'SWECH10') {
            const newDiscount = cartTotal * 0.1;
            setDiscount(newDiscount);
            const message = 'Coupon applied! You received 10% off your cart subtotal.';
            setCouponSuccess(message);
        } else {
            const message = 'Invalid coupon code. Please check and try again.';
            setDiscount(0);
            setCouponError(message);
        }
    };

    const selectedZone =
        SHIPPING_ZONES.find((zone) => zone.id === selectedZoneId) || SHIPPING_ZONES[0];

    const handleSelectZone = (zoneId) => {
        setSelectedZoneId(zoneId);
        localStorage.setItem('shippingZoneId', zoneId);
    };

    const shippingPrice = selectedZone.price;
    const grandTotal = Math.max(cartTotal - discount, 0) + shippingPrice;

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                const data = await res.json();
                // Filter out products already in cart and just show a few
                const cartIds = new Set(cart.map((item) => item._id));
                const filtered = data.filter((p) => !cartIds.has(p._id));
                setRecommendations(filtered.slice(0, 4));
            } catch (err) {
                console.error('Error fetching recommendations', err);
            }
        };

        fetchRecommendations();
    }, [cart]);

    if (cart.length === 0) {
        return (
            <div className="cart-page container" style={{ padding: '60px 0' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Cart</h1>
                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '40px',
                        borderRadius: '12px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        textAlign: 'center',
                    }}
                >
                    <i
                        className="fas fa-shopping-bag"
                        style={{ fontSize: '48px', color: '#eee', marginBottom: '20px' }}
                    ></i>
                    <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                        Your cart is currently empty.
                    </p>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <button
                            style={{
                                padding: '14px 26px',
                                borderRadius: '999px',
                                border: 'none',
                                backgroundColor: '#E41E26',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            }}
                        >
                            CONTINUE SHOPPING
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page container" style={{ padding: '30px 0 60px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' }}>Cart</h1>

            <div className="cart-layout">
                {/* Left: Cart items + coupon + recommendations */}
                <div className="cart-main-column">
                    {/* Cart items table */}
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                            marginBottom: '30px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr auto',
                                gap: '16px',
                                padding: '16px 24px',
                                borderBottom: '1px solid #f2f2f2',
                                backgroundColor: '#fafafa',
                                fontWeight: 600,
                                fontSize: '13px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.03em',
                            }}
                        >
                            <span>Product</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span style={{ textAlign: 'right' }}>Subtotal</span>
                        </div>

                        <div>
                            {cart.map((item) => (
                                <div
                                    key={item._id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 1fr 1fr auto',
                                        gap: '16px',
                                        padding: '16px 24px',
                                        borderBottom: '1px solid #f7f7f7',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                color: '#999',
                                                cursor: 'pointer',
                                                marginRight: '4px',
                                            }}
                                            aria-label="Remove item"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                        <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            style={{
                                                width: '70px',
                                                height: '70px',
                                                objectFit: 'contain',
                                                backgroundColor: '#fafafa',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <div>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.name}
                                            </p>
                                            {item.slug && (
                                                <p
                                                    style={{
                                                        margin: '4px 0 0',
                                                        fontSize: '12px',
                                                        color: '#777',
                                                    }}
                                                >
                                                    {item.slug}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#E41E26',
                                        }}
                                    >
                                        KSh {item.price.toLocaleString()}
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                borderRadius: '999px',
                                                border: '1px solid #ddd',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    border: 'none',
                                                    background: 'white',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                -
                                            </button>
                                            <span
                                                style={{
                                                    minWidth: '40px',
                                                    textAlign: 'center',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    border: 'none',
                                                    background: 'white',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            textAlign: 'right',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        KSh {(item.price * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Coupon section */}
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                            padding: '24px',
                            marginBottom: '30px',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '18px',
                                margin: '0 0 16px',
                                fontWeight: 600,
                            }}
                        >
                            Coupon
                        </h2>
                        <p style={{ fontSize: '13px', color: '#777', marginBottom: '12px' }}>
                            Enter your coupon code if you have one.
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                style={{
                                    flex: 1,
                                    minWidth: '180px',
                                    padding: '10px 14px',
                                    borderRadius: '999px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px',
                                }}
                            />
                            <button
                                onClick={handleApplyCoupon}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '999px',
                                    border: 'none',
                                    backgroundColor: '#222',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                }}
                            >
                                Apply coupon
                            </button>
                        </div>

                        {couponSuccess && (
                            <div
                                style={{
                                    marginTop: '10px',
                                    fontSize: '13px',
                                    color: '#166534',
                                    backgroundColor: '#ecfdf3',
                                    borderRadius: '8px',
                                    padding: '8px 10px',
                                }}
                            >
                                {couponSuccess}
                            </div>
                        )}
                        {couponError && (
                            <div
                                style={{
                                    marginTop: '10px',
                                    fontSize: '13px',
                                    color: '#b91c1c',
                                    backgroundColor: '#fef2f2',
                                    borderRadius: '8px',
                                    padding: '8px 10px',
                                }}
                            >
                                {couponError}
                            </div>
                        )}
                    </div>

                    {/* You may be interested in... */}
                    {recommendations.length > 0 && (
                        <section
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                                padding: '24px',
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: '18px',
                                    margin: '0 0 16px',
                                    fontWeight: 600,
                                }}
                            >
                                You may be interested in…
                            </h2>
                            <div
                                className="product-grid"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                    gap: '16px',
                                }}
                            >
                                {recommendations.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right: Cart totals + shipping table */}
                <aside className="cart-summary-column">
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                            padding: '24px',
                            marginBottom: '24px',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '18px',
                                margin: '0 0 16px',
                                fontWeight: 600,
                            }}
                        >
                            Cart totals
                        </h2>

                        <div
                            style={{
                                display: 'grid',
                                gap: '10px',
                                fontSize: '14px',
                                marginBottom: '16px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <span style={{ color: '#666' }}>Subtotal</span>
                                <span>KSh {cartTotal.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        color: '#16a34a',
                                    }}
                                >
                                    <span>Coupon Discount</span>
                                    <span>- KSh {Math.round(discount).toLocaleString()}</span>
                                </div>
                            )}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <span style={{ color: '#666' }}>Shipping ({selectedZone.label})</span>
                                <span>
                                    {shippingPrice === 0
                                        ? 'Pick up (Free)'
                                        : `KSh ${shippingPrice.toLocaleString()}`}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid #eee',
                                    paddingTop: '12px',
                                    marginTop: '6px',
                                    fontWeight: 700,
                                    fontSize: '16px',
                                    color: '#E41E26',
                                }}
                            >
                                <span>Total</span>
                                <span>KSh {Math.round(grandTotal).toLocaleString()}</span>
                            </div>
                        </div>

                        <p
                            style={{
                                fontSize: '12px',
                                color: '#777',
                                marginBottom: '16px',
                            }}
                        >
                            Shipping options and final totals will be updated during checkout based on
                            your exact delivery location.
                        </p>

                        <Link to="/checkout" style={{ textDecoration: 'none' }}>
                            <button
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    borderRadius: '999px',
                                    border: 'none',
                                    backgroundColor: '#E41E26',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '10px',
                                }}
                            >
                                Proceed to checkout
                            </button>
                        </Link>

                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <button
                                style={{
                                    width: '100%',
                                    padding: '12px 18px',
                                    borderRadius: '999px',
                                    border: '1px solid #ddd',
                                    backgroundColor: 'white',
                                    color: '#333',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                }}
                            >
                                Continue shopping
                            </button>
                        </Link>
                    </div>

                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                            padding: '20px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                        }}
                    >
                        <h3
                            style={{
                                fontSize: '15px',
                                margin: '0 0 10px',
                                fontWeight: 600,
                            }}
                        >
                            Shipment 1 – choose your delivery / pickup area
                        </h3>
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                fontSize: '13px',
                                color: '#555',
                            }}
                        >
                            {SHIPPING_ZONES.map((zone) => (
                                <li
                                    key={zone.id}
                                    style={{
                                        padding: '8px 0',
                                        borderBottom: '1px solid #f5f5f5',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '8px',
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="shippingZone"
                                        value={zone.id}
                                        checked={zone.id === selectedZoneId}
                                        onChange={() => handleSelectZone(zone.id)}
                                        style={{ marginTop: '3px' }}
                                    />
                                    <div>
                                        <span>{zone.label}: </span>
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: '#111',
                                            }}
                                        >
                                            {zone.price === 0
                                                ? 'Pick up (Free)'
                                                : `KSh ${zone.price.toLocaleString()}`}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Cart;

