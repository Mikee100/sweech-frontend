import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = ({ onCartOpen }) => {
    const { cartCount } = useCart();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
            <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
                <i className="fas fa-home"></i>
                <span>Home</span>
            </Link>

            <Link to="/search" className={`bottom-nav-item ${isActive('/search') ? 'active' : ''}`}>
                <i className="fas fa-search"></i>
                <span>Search</span>
            </Link>

            <button
                className="bottom-nav-item bottom-nav-cart"
                onClick={onCartOpen}
                aria-label="Open cart"
            >
                <span className="bottom-nav-icon-wrap">
                    <i className="fas fa-shopping-cart"></i>
                    {cartCount > 0 && <span className="bottom-cart-badge">{cartCount}</span>}
                </span>
                <span>Cart</span>
            </button>

            <Link
                to={user ? '/profile' : '/login'}
                className={`bottom-nav-item ${isActive('/profile') || isActive('/login') ? 'active' : ''}`}
            >
                <i className={user ? 'fas fa-user-circle' : 'far fa-user'}></i>
                <span>{user ? 'Account' : 'Login'}</span>
            </Link>
        </nav>
    );
};

export default MobileBottomNav;
