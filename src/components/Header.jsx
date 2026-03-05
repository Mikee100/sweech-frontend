import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CategoryModal from './CategoryModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const BRANDS = [
    'Apple',
    'Samsung',
    'Sony',
    'Dell',
    'ASUS',
    'HP',
    'Lenovo',
    'Google',
    'Canon',
    'Bose',
    'DJI',
];

const Header = ({ isCartOpen, setIsCartOpen }) => {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const { favourites } = useFavorites();
    const navigate = useNavigate();
    const location = useLocation();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [drawerSearch, setDrawerSearch] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isModalOpen || isMobileMenuOpen || isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen, isMobileMenuOpen, isCartOpen]);

    // Keep header search in sync with the current URL query (?q=...)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const qFromUrl = params.get('q') || '';
        setSearchKeyword((prev) => (prev === qFromUrl ? prev : qFromUrl));
    }, [location.pathname, location.search]);

    // Instant search (debounced) ONLY when already on /search to avoid excessive calls
    useEffect(() => {
        // Only auto-update when user is on the search results page
        if (location.pathname !== '/search') {
            return;
        }

        const handler = setTimeout(() => {
            const trimmed = searchKeyword.trim();
            const params = new URLSearchParams(location.search);
            const currentQ = params.get('q') || '';

            // Require at least 2 characters for auto-search (but allow clearing)
            if (trimmed && trimmed.length < 2) {
                return;
            }

            // Nothing to do if URL already matches the input
            if (trimmed === currentQ) {
                return;
            }

            if (trimmed) {
                params.set('q', trimmed);
            } else {
                params.delete('q');
            }
            // Reset page when search term changes
            params.delete('page');

            const searchString = params.toString();
            const targetPath = '/search' + (searchString ? `?${searchString}` : '');

            navigate(targetPath, { replace: true });
        }, 600);

        return () => clearTimeout(handler);
    }, [searchKeyword, location.pathname, location.search, navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchKeyword.trim();
        const params = new URLSearchParams(location.search);

        // If nothing typed and nothing in URL, do nothing
        if (!trimmed && !params.get('q')) {
            return;
        }

        if (trimmed) {
            params.set('q', trimmed);
        } else {
            params.delete('q');
        }
        params.delete('page');

        const searchString = params.toString();
        const targetPath = '/search' + (searchString ? `?${searchString}` : '');
        const replace = location.pathname === '/search';

        navigate(targetPath, { replace });
    };

    const handleDrawerSearch = (e) => {
        e.preventDefault();
        if (drawerSearch.trim()) {
            navigate(`/search?q=${encodeURIComponent(drawerSearch.trim())}`);
            setDrawerSearch('');
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <header className={`modern-header ${isSticky ? 'is-sticky' : ''}`}>
                <div className="top-banner">
                    <div className="container">
                        <p>🚀 Free Delivery on orders over KSh 20,000 | Support: +254 700 000 000</p>
                    </div>
                </div>

                <div className="main-nav-wrapper">
                    <div className="container header-grid">
                        {/* Logo Block */}
                        <div className="logo-area">
                            <Link to="/" className="brand-logo">
                                <span className="logo-accent">C</span>ASEPROZ
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <nav className="central-nav">
                            <ul className="nav-list">
                                <li className="nav-li dropdown-trigger" onClick={() => setIsModalOpen(true)}>
                                    <button type="button" className="nav-link">
                                        <i className="fas fa-th-large"></i> CATEGORIES
                                    </button>
                                </li>
                                <li className="nav-li brand-nav">
                                    <button type="button" className="nav-link">
                                        <i className="fas fa-tags"></i> SHOP BY BRAND
                                    </button>
                                    <div className="brand-mega">
                                        <div className="brand-mega-inner">
                                            {BRANDS.map((brand) => (
                                                <button
                                                    key={brand}
                                                    type="button"
                                                    className="brand-pill"
                                                    onClick={() => {
                                                        navigate(`/search?brand=${encodeURIComponent(brand)}`);
                                                    }}
                                                >
                                                    {brand}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </li>
                                <li className="nav-li">
                                    <Link to="/" className="nav-link">HOME</Link>
                                </li>
                                <li className="nav-li">
                                    <Link to="/contact" className="nav-link">CONTACT</Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Search Block */}
                        <div className="search-area">
                            <form className="premium-search" onSubmit={handleSearch}>
                                <i className="fas fa-search search-icon"></i>
                                <input
                                    type="text"
                                    placeholder="What are you looking for?"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                                <button type="submit" className="premium-search-btn">FIND</button>
                            </form>
                        </div>

                        {/* Icons Area */}
                        <div className="actions-area">
                            <div
                                className="action-ic"
                                title="Wishlist"
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate('/favourites')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        navigate('/favourites');
                                    }
                                }}
                            >
                                <i className="far fa-heart"></i>
                                {favourites.length > 0 && (
                                    <span className="badge-count">{favourites.length}</span>
                                )}
                            </div>

                            <div
                                className="action-ic cart-trigger"
                                role="button"
                                tabIndex={0}
                                aria-label="Go to cart page"
                                onClick={() => navigate('/cart')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        navigate('/cart');
                                    }
                                }}
                            >
                                <i className="fas fa-shopping-cart"></i>
                                {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
                            </div>

                            {user ? (
                                <div className="user-profile-nav">
                                    <div className="user-trigger" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                                        <div className="user-avatar">
                                            {user.name.charAt(0)}
                                        </div>
                                        <i className={`fas fa-chevron-down ${isUserMenuOpen ? 'rotate' : ''}`}></i>
                                    </div>

                                    {isUserMenuOpen && (
                                        <div className="premium-dropdown">
                                            <div className="dropdown-header">
                                                <p className="welcome-msg">Hello, <strong>{user.name.split(' ')[0]}</strong></p>
                                            </div>
                                            <div className="dropdown-body">
                                                <Link to="/profile" className="drop-link" onClick={() => setIsUserMenuOpen(false)}>
                                                    <i className="far fa-user-circle"></i> My Account
                                                </Link>
                                                <Link to="/orders" className="drop-link" onClick={() => setIsUserMenuOpen(false)}>
                                                    <i className="fas fa-history"></i> My Orders
                                                </Link>
                                                {user.isAdmin && (
                                                    <Link to="/admin/productlist" className="drop-link admin-link" onClick={() => setIsUserMenuOpen(false)}>
                                                        <i className="fas fa-user-shield"></i> Admin Panel
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="dropdown-footer">
                                                <button className="logout-btn" onClick={() => { logout(); setIsUserMenuOpen(false); }}>
                                                    <i className="fas fa-sign-out-alt"></i> Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="login-pill">
                                    <i className="far fa-user"></i> LOGIN
                                </Link>
                            )}

                            <div
                                className="mobile-menu-btn"
                                role="button"
                                tabIndex={0}
                                aria-label="Open navigation menu"
                                onClick={() => setIsMobileMenuOpen(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setIsMobileMenuOpen(true);
                                    }
                                }}
                            >
                                <i className="fas fa-bars"></i>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Bar – shown below logo row on small screens */}
                    <div className="mobile-search-bar">
                        <form className="mobile-search-form" onSubmit={handleSearch}>
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                            <button type="submit">Go</button>
                        </form>
                    </div>
                </div>
            </header>

            <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Mobile Sidebar / Drawer */}
            {isMobileMenuOpen && (
                <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
                        <div className="drawer-header">
                            <span className="brand-logo small"><span className="logo-accent">C</span>ASEPROZ</span>
                            <button className="close-drawer" onClick={() => setIsMobileMenuOpen(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Drawer Search */}
                        <form className="drawer-search-form" onSubmit={handleDrawerSearch}>
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={drawerSearch}
                                onChange={(e) => setDrawerSearch(e.target.value)}
                            />
                        </form>

                        {/* User greeting in drawer */}
                        {user && (
                            <div className="drawer-user-info">
                                <div className="drawer-user-avatar">{user.name.charAt(0)}</div>
                                <div>
                                    <p className="drawer-user-name">{user.name}</p>
                                    <p className="drawer-user-email">{user.email}</p>
                                </div>
                            </div>
                        )}

                        <ul className="drawer-links">
                            <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}><i className="fas fa-home"></i> HOME</Link></li>
                            <li><Link to="/search" onClick={() => setIsMobileMenuOpen(false)}><i className="fas fa-store"></i> SHOP ALL</Link></li>
                            <li>
                                <button onClick={() => { setIsMobileMenuOpen(false); setIsModalOpen(true); }}>
                                    <i className="fas fa-th-large"></i> CATEGORIES
                                </button>
                            </li>
                            <li>
                                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af' }}>
                                    Shop by brand
                                </span>
                            </li>
                            {BRANDS.map((brand) => (
                                <li key={brand}>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            navigate(`/search?brand=${encodeURIComponent(brand)}`);
                                        }}
                                    >
                                        <i className="fas fa-tags"></i> {brand}
                                    </button>
                                </li>
                            ))}
                            <li><Link to="/favourites" onClick={() => setIsMobileMenuOpen(false)}><i className="far fa-heart"></i> WISHLIST {favourites.length > 0 && <span className="drawer-badge">{favourites.length}</span>}</Link></li>
                            {user ? (
                                <>
                                    <li><Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}><i className="far fa-user-circle"></i> MY ACCOUNT</Link></li>
                                    <li><Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}><i className="fas fa-history"></i> MY ORDERS</Link></li>
                                    {user.isAdmin && (
                                        <li><Link to="/admin/productlist" onClick={() => setIsMobileMenuOpen(false)}><i className="fas fa-user-shield"></i> ADMIN PANEL</Link></li>
                                    )}
                                    <li>
                                        <button className="drawer-logout" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                                            <i className="fas fa-sign-out-alt"></i> LOGOUT
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li><Link to="/login" onClick={() => setIsMobileMenuOpen(false)}><i className="far fa-user"></i> LOGIN / REGISTER</Link></li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
