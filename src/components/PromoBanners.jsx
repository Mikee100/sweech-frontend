import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PromoBanners = () => {
    return (
        <section className="promo-banners container">
            <div className="promo-grid">
                <motion.div
                    className="promo-item large"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    style={{ backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url("https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1964&auto=format&fit=crop")' }}
                >
                    <div className="promo-content">
                        <span className="promo-tag">Flash Sale</span>
                        <h2>Premium Accessories</h2>
                        <p>Up to 40% OFF on all premium tech accessories.</p>
                        <Link to="/category/Accessories" className="promo-btn">Shop Now</Link>
                    </div>
                </motion.div>

                <motion.div
                    className="promo-item small"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    style={{ backgroundImage: 'linear-gradient(45deg, rgba(225,38,28,0.8), rgba(225,38,28,0.4)), url("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop")' }}
                >
                    <div className="promo-content">
                        <span className="promo-tag light">New Arrival</span>
                        <h2>Smart Home</h2>
                        <p>Upgrade your living space.</p>
                        <Link to="/category/Smart Home" className="promo-btn light">Explore</Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PromoBanners;
