import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
    {
        name: "Phones & Tablets",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1780&auto=format&fit=crop",
        count: "Explore Now",
        color: "#fdf2f2"
    },
    {
        name: "Computers & Laptops",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
        count: "View Items",
        color: "#f0f7ff"
    },
    {
        name: "Audio & Headphones",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
        count: "Top Picks",
        color: "#f5f3ff"
    },
    {
        name: "Gaming",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
        count: "Trending",
        color: "#fdfcea"
    }
];

const CategoryShowcase = () => {
    return (
        <section className="category-showcase container">
            <div className="section-header">
                <div className="title-area">
                    <span className="subtitle">EXPLORE</span>
                    <h2 className="main-title">Top Categories</h2>
                </div>
                <Link to="/search" className="view-all">
                    View All <ChevronRight size={16} />
                </Link>
            </div>

            <div className="category-grid">
                {categories.map((cat, index) => (
                    <motion.div
                        key={index}
                        className="category-card"
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link to={`/category/${cat.name}`}>
                            <div className="cat-image-wrapper">
                                <img src={cat.image} alt={cat.name} />
                                <div className="item-count">{cat.count}</div>
                            </div>
                            <div className="cat-info">
                                <h3>{cat.name}</h3>
                                <p>Great collection</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default CategoryShowcase;
