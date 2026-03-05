import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const { isFavourite, toggleFavourite } = useFavorites();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${slug}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data);
                setMainImage(data.images[0]);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const handleQuantityChange = (type) => {
        if (type === 'inc') {
            setQuantity(prev => prev + 1);
        } else if (type === 'dec' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (product && product.stock > 0) {
            addToCart(product, quantity);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 3000);
        }
    };

    const handleToggleFavourite = () => {
        if (!product) return;

        if (!user) {
            navigate('/login');
            return;
        }

        toggleFavourite(product);
    };

    if (loading)
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <div className="loading-spinner large"></div>
                <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '14px' }}>Loading product...</p>
            </div>
        );
    if (error) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>{error}</div>;
    if (!product) return null;

    const hasDiscount =
        typeof product.originalPrice === 'number' &&
        product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    return (
        <div className="product-details-page container">
            {/* Breadcrumb */}
            <nav className="pd-breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <span>{product.category}</span>
                <span>/</span>
                <span className="pd-breadcrumb-current">{product.name}</span>
            </nav>

            <div className="pd-layout">
                {/* Images Section */}
                <div className="pd-images">
                    <div className="pd-main-image">
                        <img
                            src={mainImage}
                            alt={product.name}
                        />
                    </div>
                    <div className="pd-thumbnails">
                        {product.images.map((img, index) => (
                            <div
                                key={index}
                                className={`pd-thumb ${mainImage === img ? 'active' : ''}`}
                                onClick={() => setMainImage(img)}
                            >
                                <img src={img} alt="" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="pd-info">
                    <span className="pd-category">{product.category}</span>
                    <h1 className="pd-name">{product.name}</h1>

                    <div className="pd-price-row">
                        <span className="pd-price">KSh {product.price.toLocaleString()}</span>
                        {hasDiscount && (
                            <>
                                <span className="pd-original-price">
                                    KSh {product.originalPrice.toLocaleString()}
                                </span>
                                {discountPercent !== null && (
                                    <span className="pd-saving-pill">
                                        Save {discountPercent}%
                                    </span>
                                )}
                            </>
                        )}
                        {product.onSale && !hasDiscount && (
                            <span className="pd-sale-badge">SALE</span>
                        )}
                    </div>

                    {product.keyFeatures && product.keyFeatures.length > 0 && (
                        <div className="pd-features">
                            <ul>
                                {product.keyFeatures.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <p className="pd-description">{product.description}</p>

                    <div className="pd-availability">
                        <span className="pd-avail-label">Availability: </span>
                        <span className={product.stock > 0 ? 'pd-in-stock' : 'pd-out-stock'}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                        {product.stock > 0 && product.stock <= 5 && (
                            <p className="pd-low-stock">
                                Only {product.stock} left – almost gone!
                            </p>
                        )}
                    </div>

                    {/* Actions Row */}
                    <div className="pd-actions">
                        <div className="pd-qty">
                            <button onClick={() => handleQuantityChange('dec')}>−</button>
                            <input type="text" value={quantity} readOnly />
                            <button onClick={() => handleQuantityChange('inc')}>+</button>
                        </div>
                        <button
                            className="pd-add-to-cart"
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                        >
                            {product.stock <= 0 ? (
                                <span>Out of stock</span>
                            ) : addedToCart ? (
                                <>
                                    <span>✓ Added to cart</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-shopping-cart" style={{ fontSize: 15 }}></i>
                                    <span>Add to cart</span>
                                </>
                            )}
                        </button>
                        <button
                            className="pd-wishlist"
                            onClick={handleToggleFavourite}
                            title={isFavourite(product._id) ? 'Remove from favourites' : 'Add to favourites'}
                        >
                            <i className={isFavourite(product._id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                        </button>
                    </div>

                    <ul className="pd-trust-list">
                        <li>
                            <i className="fas fa-shield-alt"></i>
                            <span>12‑month limited warranty on this product</span>
                        </li>
                        <li>
                            <i className="fas fa-truck"></i>
                            <span>Fast delivery across Nairobi & major towns</span>
                        </li>
                        <li>
                            <i className="fas fa-undo"></i>
                            <span>7‑day return policy for eligible items</span>
                        </li>
                    </ul>

                    {/* Specifications */}
                    <div className="pd-specs">
                        <h3>Specifications</h3>
                        <div className="pd-specs-grid">
                            {product.specs && product.specs.length > 0 ? (
                                product.specs.map((spec, index) => (
                                    <div key={index} className="pd-spec-row">
                                        <span className="pd-spec-key">{spec.key}</span>
                                        <span className="pd-spec-val">{spec.value}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="pd-no-specs">No specifications available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
