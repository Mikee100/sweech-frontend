import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { favourites, isFavourite, toggleFavourite } = useFavorites();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        console.log('ProductCard: handleAddToCart clicked', product.name);
        if (product.stock > 0) {
            addToCart(product);
        } else {
            console.log('ProductCard: Stock is 0');
        }
    };

    const handleToggleFavourite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/login');
            return;
        }

        toggleFavourite(product);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-image-wrapper">
                    <img src={product.images[0] || 'https://via.placeholder.com/300'} alt={product.name} />
                    {product.onSale && <span className="badge sale">Sale!</span>}
                    {product.stock <= 0 && <span className="badge out-of-stock">Out of Stock</span>}
                    <div className="product-actions">
                        <button
                            className="wishlist-btn"
                            title={isFavourite(product._id) ? 'Remove from favourites' : 'Add to favourites'}
                            onClick={handleToggleFavourite}
                        >
                            <i className={isFavourite(product._id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                        </button>
                    </div>
                </div>
            </Link>
            <div className="product-info">
                <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <p className="product-category">{product.category || 'Electronics'}</p>
                    <h3 className="product-title">{product.name}</h3>
                </Link>
                <div className="product-price">
                    {product.originalPrice && <span className="original-price">Ksh {product.originalPrice.toLocaleString()}</span>}
                    <span className="current-price">Ksh {product.price.toLocaleString()}</span>
                </div>
                <div className="card-footer">
                    <button
                        className="add-to-cart-btn-v2"
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                    >
                        {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
