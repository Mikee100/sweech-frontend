import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';

const Favourites = () => {
    const { user } = useAuth();
    const { favourites, favouritesLoading } = useFavorites();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/favourites');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="favourites-page">
            <section className="fav-hero">
                <div className="container">
                    <motion.div
                        className="fav-hero-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="fav-badge">
                            <Heart size={14} fill="currentColor" />
                            <span>My Wishlist</span>
                        </div>
                        <h1>Your Premium Collection</h1>
                        <p className="fav-subtitle">
                            Keep track of the tech you love. Add to cart whenever you're ready.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="fav-content-section">
                <div className="container">
                    {favouritesLoading ? (
                        <div className="fav-loading">
                            <Loader2 className="spinner" size={40} />
                            <p>Fetching your favorites...</p>
                        </div>
                    ) : favourites.length === 0 ? (
                        <motion.div
                            className="fav-empty-state"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="empty-icon-box">
                                <Heart size={60} strokeWidth={1} />
                            </div>
                            <h2>Your wishlist is empty</h2>
                            <p>
                                Explore our curated collection and save items you love for later.
                            </p>
                            <Link to="/" className="btn-primary fav-browse-btn">
                                START EXPLORING
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="fav-grid-container"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            <div className="fav-grid-header">
                                <p>Showing <strong>{favourites.length}</strong> items in your wishlist</p>
                            </div>
                            <div className="product-grid">
                                {favourites.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Favourites;
