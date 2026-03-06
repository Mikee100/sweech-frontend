import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import ProductDescriptionSection from '../components/ProductDescriptionSection';

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
    const [isZoomActive, setIsZoomActive] = useState(false);
    const [zoomTransform, setZoomTransform] = useState(null);
    const [variantOptions, setVariantOptions] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${slug}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data);
                setMainImage(data.images?.[0] || '');
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    // Load variants and related products once we know the main product
    useEffect(() => {
        const loadExtraData = async () => {
            if (!product) return;

            try {
                // Variants: same variantGroup, different _id
                if (product.variantGroup) {
                    const variantRes = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/products?variantGroup=${encodeURIComponent(
                            product.variantGroup
                        )}`
                    );
                    if (variantRes.ok) {
                        const variantData = await variantRes.json();
                        const list = Array.isArray(variantData) ? variantData : variantData.products || [];
                        // Only treat products with an explicit variantLabel as true variants
                        const siblings = list.filter(
                            (p) => p._id !== product._id && p.variantLabel
                        );
                        setVariantOptions(siblings);
                    } else {
                        setVariantOptions([]);
                    }
                } else {
                    setVariantOptions([]);
                }

                // Related products: same category/subCategory, different _id
                const params = new URLSearchParams();
                if (product.category) params.append('category', product.category);
                if (product.subCategory) params.append('subCategory', product.subCategory);

                const relatedRes = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/products?${params.toString()}`
                );
                if (relatedRes.ok) {
                    const relatedData = await relatedRes.json();
                    const list = Array.isArray(relatedData) ? relatedData : relatedData.products || [];
                    const filtered = list.filter((p) => p._id !== product._id);
                    setRelatedProducts(filtered.slice(0, 4));
                }
            } catch {
                // fail silently for extra data
            }
        };

        loadExtraData();
    }, [product]);

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

    const handleImageMouseEnter = () => {
        // Basic guard: skip zoom on very small screens
        if (window.innerWidth < 768) return;
        setIsZoomActive(true);
    };

    const handleImageMouseLeave = () => {
        setIsZoomActive(false);
        setZoomTransform(null);
    };

    const handleImageMouseMove = (e) => {
        if (!isZoomActive) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomTransform({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(1.7)',
        });
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

    const categoryParam = product.category ? encodeURIComponent(product.category) : '';
    const metaCategories = Array.from(
        new Map(
            [
                ...(Array.isArray(product.categories) ? product.categories : []),
                product.category,
                product.subCategory,
            ]
                .filter(Boolean)
                .map((c) => [String(c).trim().toLowerCase(), String(c).trim()])
        ).values()
    );

    return (
        <div className="product-details-page container">
            <div className="pd-layout">
                {/* Left: Thumbnails + Main image area (feature headline, image, notes) */}
                <div className="pd-images">
                    <div className="pd-thumbnails-col">
                        {product.images?.length > 0 && product.images.map((img, index) => (
                            <div
                                key={index}
                                className={`pd-thumb ${mainImage === img ? 'active' : ''}`}
                                onClick={() => setMainImage(img)}
                            >
                                <img src={img} alt="" />
                            </div>
                        ))}
                    </div>
                    <div className="pd-main-col">
                        {(product.featureHeadline || product.featureSubtext) && (
                            <div className="pd-feature-headline">
                                {product.featureHeadline && (
                                    <div className="pd-feature-headline-text">{product.featureHeadline}</div>
                                )}
                                {product.featureSubtext && (
                                    <div className="pd-feature-subtext">{product.featureSubtext}</div>
                                )}
                            </div>
                        )}
                        <div
                            className={`pd-main-image ${isZoomActive ? 'pd-main-image--zoom' : ''}`}
                            onMouseEnter={handleImageMouseEnter}
                            onMouseLeave={handleImageMouseLeave}
                            onMouseMove={handleImageMouseMove}
                        >
                            <img
                                src={mainImage}
                                alt={product.name}
                                style={zoomTransform || undefined}
                            />
                        </div>
                        {product.notes && product.notes.length > 0 && (
                            <div className="pd-notes">
                                <div className="pd-notes-title">Notes</div>
                                <ul>
                                    {product.notes.map((note, index) => (
                                        <li key={index}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Breadcrumb, title, price, features, actions, metadata */}
                <div className="pd-info">
                    <nav className="pd-breadcrumb">
                        <Link to="/">HOME</Link>
                        <span>/</span>
                        <Link to={categoryParam ? `/search?category=${categoryParam}` : '#'}>{product.category?.toUpperCase()}</Link>
                    </nav>

                    <h1 className="pd-name">{product.name}</h1>

                    {variantOptions.length > 0 && (
                        <div className="pd-variants">
                            <span className="pd-variants-label">Variants:</span>
                            <div className="pd-variants-list">
                                {[product, ...variantOptions].map((item) => (
                                    <button
                                        key={item._id}
                                        type="button"
                                        className={`pd-variant-pill ${item.slug === product.slug ? 'active' : ''}`}
                                        onClick={() => {
                                            if (item.slug !== product.slug) {
                                                navigate(`/product/${item.slug}`);
                                            }
                                        }}
                                    >
                                        {item.variantLabel || item.color || item.subCategory || 'Option'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pd-price-row">
                        <span className="pd-price-dot"></span>
                        <span className="pd-price">KSh {product.price.toLocaleString()}</span>
                        {hasDiscount && (
                            <>
                                <span className="pd-original-price">
                                    KSh {product.originalPrice.toLocaleString()}
                                </span>
                                {discountPercent !== null && (
                                    <span className="pd-saving-pill">Save {discountPercent}%</span>
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

                    <div className="pd-actions">
                        <div className="pd-qty">
                            <button type="button" onClick={() => handleQuantityChange('dec')} aria-label="Decrease quantity">−</button>
                            <input type="text" value={quantity} readOnly aria-label="Quantity" />
                            <button type="button" onClick={() => handleQuantityChange('inc')} aria-label="Increase quantity">+</button>
                        </div>
                        <button
                            className="pd-add-to-cart"
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                        >
                            {product.stock <= 0 ? 'Out of stock' : addedToCart ? '✓ Added to cart' : 'ADD TO CART'}
                        </button>
                    </div>

                    <button
                        type="button"
                        className="pd-add-to-wishlist-link"
                        onClick={handleToggleFavourite}
                        title={isFavourite(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <i className={isFavourite(product._id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                        <span>ADD TO WISHLIST</span>
                    </button>

                    <div className="pd-meta">
                        {product.sku && (
                            <div className="pd-meta-row">
                                <span className="pd-meta-label">SKU:</span>
                                <span className="pd-meta-value">{product.sku}</span>
                            </div>
                        )}
                        <div className="pd-meta-row">
                            <span className="pd-meta-label">CATEGORIES:</span>
                            <span className="pd-meta-value">
                                {metaCategories.length > 0 ? (
                                    <>
                                        <Link to={categoryParam ? `/search?category=${categoryParam}` : '#'}>{metaCategories[0]}</Link>
                                        {metaCategories.slice(1).map((c) => `, ${c}`)}
                                    </>
                                ) : (
                                    '-'
                                )}
                            </span>
                        </div>
                        {product.brand && (
                            <div className="pd-meta-row">
                                <span className="pd-meta-label">BRAND:</span>
                                <span className="pd-meta-value">{product.brand}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ProductDescriptionSection html={product.description} />

            {relatedProducts.length > 0 && (
                <section className="pd-related">
                    <div className="pd-related-header">
                        <h2 className="pd-related-title">Related products</h2>
                        <p className="pd-related-subtitle">Customers also viewed these</p>
                    </div>
                    <div className="pd-related-grid">
                        {relatedProducts.map((rp) => (
                            <React.Suspense fallback={null} key={rp._id}>
                                {/* Inline lightweight card to avoid circular imports */}
                                <div className="pd-related-card">
                                    <Link
                                        to={`/product/${rp.slug}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <div className="pd-related-image-wrap">
                                            <img
                                                src={
                                                    rp.images?.[0] ||
                                                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop'
                                                }
                                                alt={rp.name}
                                            />
                                        </div>
                                        <div className="pd-related-info">
                                            <div className="pd-related-name">{rp.name}</div>
                                            <div className="pd-related-price">
                                                KSh {rp.price?.toLocaleString()}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </React.Suspense>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductDetails;
