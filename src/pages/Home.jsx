import React, { useState, useEffect } from 'react';
import HomeSlider from '../components/HomeSlider';
import FeatureStats from '../components/FeatureStats';
import CategoryShowcase from '../components/CategoryShowcase';
import PromoBanners from '../components/PromoBanners';
import ProductCard from '../components/ProductCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                // Take only first 8 products for the home page
                setProducts(data.slice(0, 8));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="home-page">
            <HomeSlider />
            <FeatureStats />
            <CategoryShowcase />
            <PromoBanners />

            <section className="featured-section container">
                <div className="section-header">
                    <div className="title-area">
                        <span className="subtitle">TRENDING</span>
                        <h2 className="main-title">Featured Products</h2>
                    </div>
                    <Link to="/search" className="view-all">
                        Shop All <ChevronRight size={16} />
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-state">Loading products...</div>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
