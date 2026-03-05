import React, { useState, useEffect } from 'react';
import HomeSlider from '../components/HomeSlider';
import FeatureStats from '../components/FeatureStats';
import CategoryShowcase from '../components/CategoryShowcase';
import PromoBanners from '../components/PromoBanners';
import ProductCard from '../components/ProductCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const curatedCollections = [
    {
        id: 'work-essentials',
        title: 'Work & Study Essentials',
        tagline: 'Laptops, tablets, and accessories for productive days.',
        query: 'office',
    },
    {
        id: 'creator-setup',
        title: 'Creator Setup',
        tagline: 'Gear for designers, photographers, and content creators.',
        query: 'creator',
    },
    {
        id: 'gaming-battle-station',
        title: 'Gaming Battle Station',
        tagline: 'Consoles, monitors, and accessories for serious gamers.',
        query: 'gaming',
    },
];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                const data = await response.json();
                // Load full list so we can show more rich sections
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const featured = products.slice(0, 16);
    const onSale = products.filter((p) => p.onSale).slice(0, 8);
    const latest = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

    // Derived views for deeper home sections
    const bestValue = [...products]
        .filter((p) => p.onSale || (p.originalPrice && p.originalPrice > p.price))
        .sort((a, b) => {
            const discountA = a.originalPrice ? a.originalPrice - a.price : 0;
            const discountB = b.originalPrice ? b.originalPrice - b.price : 0;
            return discountB - discountA;
        })
        .slice(0, 8);

    const budgetPicks = [...products]
        .sort((a, b) => a.price - b.price)
        .slice(0, 8);

    const premiumPicks = [...products]
        .sort((a, b) => b.price - a.price)
        .slice(0, 8);

    const featuredByFlag = products.filter((p) => p.isFeatured).slice(0, 8);

    const budgetBrackets = [
        { id: 'under-50k', label: 'Under KES 50,000', min: 0, max: 50000 },
        {
            id: '50k-100k',
            label: 'KES 50,000 – 100,000',
            min: 50000,
            max: 100000,
        },
        {
            id: '100k-200k',
            label: 'KES 100,000 – 200,000',
            min: 100000,
            max: 200000,
        },
        {
            id: '200k-plus',
            label: 'KES 200,000+',
            min: 200000,
            max: null,
        },
    ];

    const budgetStats = budgetBrackets
        .map((bracket) => {
            const count = products.filter((p) => {
                if (typeof p.price !== 'number') return false;
                if (bracket.max != null) {
                    return p.price >= bracket.min && p.price <= bracket.max;
                }
                return p.price >= bracket.min;
            }).length;

            return { ...bracket, count };
        })
        .filter((bracket) => bracket.count > 0);

    const categoriesMap = products.reduce((acc, product) => {
        if (!product.category) return acc;
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
    }, {});

    const subCategoryMap = products.reduce((acc, product) => {
        if (!product.subCategory) return acc;
        if (!acc[product.subCategory]) acc[product.subCategory] = [];
        acc[product.subCategory].push(product);
        return acc;
    }, {});

    const topCategories = Object.entries(categoriesMap)
        .sort(([, productsA], [, productsB]) => productsB.length - productsA.length)
        .slice(0, 3);

    const topSubCategories = Object.entries(subCategoryMap)
        .sort(([, productsA], [, productsB]) => productsB.length - productsA.length)
        .slice(0, 6);

    const hasAnyStats =
        products.length > 0 || onSale.length > 0 || latest.length > 0;

    return (
        <div className="home-page">
            <HomeSlider />
            <FeatureStats />
            <CategoryShowcase />
            <PromoBanners />

            {/* Quick catalogue summary strip */}
            {!loading && (
                <section className="home-meta-band">
                    <div className="container home-meta-grid">
                        {hasAnyStats ? (
                            <>
                                <div>
                                    <p className="meta-label">Products in catalog</p>
                                    <p className="meta-value">
                                        {products.length.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="meta-label">Hand‑picked deals</p>
                                    <p className="meta-value">
                                        {onSale.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="meta-label">New this week</p>
                                    <p className="meta-value">
                                        {latest.length}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="home-meta-empty">
                                <p className="home-meta-eyebrow">
                                    Store setup in progress
                                </p>
                                <h3>Fresh products are coming soon</h3>
                                <p>
                                    We&apos;re stocking the shelves with premium cases and gadgets.
                                    Check back in a bit for new arrivals, curated deals, and more.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Featured products – bigger grid */}
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
                        {featured.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* New arrivals */}
            {!loading && latest.length > 0 && (
                <section className="featured-section container">
                    <div className="section-header">
                        <div className="title-area">
                            <span className="subtitle">JUST IN</span>
                            <h2 className="main-title">New Arrivals</h2>
                        </div>
                    </div>
                    <div className="product-grid">
                        {latest.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* On sale now */}
            {!loading && onSale.length > 0 && (
                <section className="featured-section container">
                    <div className="section-header">
                        <div className="title-area">
                            <span className="subtitle">HOT DEALS</span>
                            <h2 className="main-title">On Sale Right Now</h2>
                        </div>
                        <Link to="/search?sort=newest" className="view-all">
                            View More Deals <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="product-grid">
                        {onSale.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Layer: Best value deals */}
            {!loading && bestValue.length > 0 && (
                <section className="home-layer-section container">
                    <div className="section-header">
                        <div className="title-area">
                            <span className="subtitle">BEST VALUE</span>
                            <h2 className="main-title">Biggest Savings Right Now</h2>
                            <p className="section-kicker">
                                Deep discounts on premium tech – limited stock on these deals.
                            </p>
                        </div>
                        <Link to="/search?sort=discount" className="view-all">
                            View all savings <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="product-grid">
                        {bestValue.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Layer: Budget picks */}
            {!loading && budgetPicks.length > 0 && (
                <section className="home-layer-section container">
                    <div className="section-header">
                        <div className="title-area">
                            <span className="subtitle">BUDGET PICKS</span>
                            <h2 className="main-title">Most Affordable Favourites</h2>
                            <p className="section-kicker">
                                Great tech that won&apos;t break the bank – perfect everyday upgrades.
                            </p>
                        </div>
                        <Link to="/search?sort=price_asc" className="view-all">
                            Shop by lowest price <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="product-grid">
                        {budgetPicks.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Layer: Premium / hero products */}
            {!loading && premiumPicks.length > 0 && (
                <section className="home-layer-section container">
                    <div className="section-header">
                        <div className="title-area">
                            <span className="subtitle">PREMIUM PICKS</span>
                            <h2 className="main-title">Flagship & High‑End Gear</h2>
                            <p className="section-kicker">
                                Top‑tier devices for power users, creators, and gamers.
                            </p>
                        </div>
                        <Link to="/search?sort=price_desc" className="view-all">
                            Explore premium range <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="product-grid">
                        {premiumPicks.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Layer: Featured by admin flag */}
            {!loading && featuredByFlag.length > 0 && (
                <section className="home-layer-section container">
                    <div className="section-header">
                        <div className="title-area">
                            <span className="subtitle">EDITOR&apos;S CHOICE</span>
                            <h2 className="main-title">Handpicked CaseProz Favourites</h2>
                            <p className="section-kicker">
                                A curated mix of best‑looking and most loved products.
                            </p>
                        </div>
                    </div>
                    <div className="product-grid">
                        {featuredByFlag.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Layer: Category spotlight */}
            {!loading && topCategories.length > 0 && (
                <section className="home-layer-section container">
                    <div className="section-header">
                        <div className="title-area">
                            <span className="subtitle">SHOP BY CATEGORY</span>
                            <h2 className="main-title">Dive Into Key Categories</h2>
                            <p className="section-kicker">
                                Quick access into the busiest sections of our catalog.
                            </p>
                        </div>
                    </div>
                    <div className="category-strip">
                        {topCategories.map(([categoryName, categoryProducts]) => (
                            <div key={categoryName} className="category-strip-card">
                                <div className="category-strip-header">
                                    <h3>{categoryName}</h3>
                                    <span className="category-strip-count">
                                        {categoryProducts.length} items
                                    </span>
                                </div>
                                <div className="category-strip-grid">
                                    {categoryProducts.slice(0, 4).map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                                <Link
                                    to={`/search?category=${encodeURIComponent(
                                        categoryName
                                    )}`}
                                    className="category-strip-link"
                                >
                                    View all {categoryName} <ChevronRight size={14} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Layer: Sub‑category discovery */}
            {!loading && topSubCategories.length > 0 && (
                <section className="home-layer-section container">
                    <div className="section-header">
                        <div className="title-area">
                            <span className="subtitle">DISCOVER MORE</span>
                            <h2 className="main-title">Popular Sub‑Categories</h2>
                            <p className="section-kicker">
                                Find exactly what you&apos;re looking for – fast.
                            </p>
                        </div>
                    </div>
                    <div className="subcategory-pill-strip">
                        {topSubCategories.map(([subCategoryName, subCategoryProducts]) => (
                            <Link
                                key={subCategoryName}
                                to={`/search?subCategory=${encodeURIComponent(
                                    subCategoryName
                                )}`}
                                className="subcategory-pill"
                            >
                                <span className="subcategory-name">
                                    {subCategoryName}
                                </span>
                                <span className="subcategory-count">
                                    {subCategoryProducts.length} items
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Layer: Shop by budget */}
            {!loading && budgetStats.length > 0 && (
                <section className="home-layer-section container">
                    <div className="section-header">
                        <div className="title-area">
                            <span className="subtitle">SHOP BY BUDGET</span>
                            <h2 className="main-title">Find Tech for Every Wallet</h2>
                            <p className="section-kicker">
                                Jump straight into price ranges that match your budget.
                            </p>
                        </div>
                    </div>
                    <div className="budget-band">
                        {budgetStats.map((bracket) => {
                            const params = new URLSearchParams();
                            params.set('minPrice', String(bracket.min));
                            if (bracket.max != null) {
                                params.set('maxPrice', String(bracket.max));
                            }

                            return (
                                <Link
                                    key={bracket.id}
                                    to={`/search?${params.toString()}`}
                                    className="budget-pill"
                                >
                                    <div className="budget-label">{bracket.label}</div>
                                    <div className="budget-count">
                                        {bracket.count} item{bracket.count === 1 ? '' : 's'}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Layer: Curated collections */}
            <section className="home-layer-section container">
                <div className="section-header">
                    <div className="title-area">
                        <span className="subtitle">CURATED SETUPS</span>
                        <h2 className="main-title">Explore Ready‑Made Collections</h2>
                        <p className="section-kicker">
                            Shortcuts to popular ways people shop CaseProz today.
                        </p>
                    </div>
                </div>
                <div className="collections-grid">
                    {curatedCollections.map((collection) => (
                        <Link
                            key={collection.id}
                            to={`/search?q=${encodeURIComponent(collection.query)}`}
                            className="collection-card"
                        >
                            <div className="collection-tag">Collection</div>
                            <h3 className="collection-title">{collection.title}</h3>
                            <p className="collection-copy">{collection.tagline}</p>
                            <span className="collection-cta">
                                View collection <ChevronRight size={14} />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
