import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonProduct from '../components/SkeletonProduct';
import SearchFilters from '../components/SearchFilters';
import { SlidersHorizontal, X } from 'lucide-react';

const Search = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const location = useLocation();

    // Parse query parameter ?q=...
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('q') || '';
    const hasQuery = q.trim().length > 0;

    useEffect(() => {
        if (!hasQuery) {
            setProducts([]);
            setTotal(0);
            setPages(1);
            setLoading(false);
            return;
        }

        const fetchSearchResults = async () => {
            setLoading(true);
            setError('');

            try {
                const params = new URLSearchParams();
                params.append('keyword', q);
                params.append('page', String(page));
                params.append('pageSize', '12');

                if (selectedCategory) {
                    params.append('category', selectedCategory);
                }

                if (priceRange.min) {
                    params.append('minPrice', String(priceRange.min));
                }

                if (priceRange.max) {
                    params.append('maxPrice', String(priceRange.max));
                }

                const sortMap = {
                    'newest': 'newest',
                    'price-low': 'priceAsc',
                    'price-high': 'priceDesc',
                    'name-asc': 'nameAsc',
                };

                const sortParam = sortMap[sort] || 'newest';
                params.append('sort', sortParam);

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?${params.toString()}`);
                const data = await response.json();

                if (response.ok) {
                    if (Array.isArray(data)) {
                        setProducts(data);
                        setTotal(data.length);
                        setPages(1);
                    } else {
                        setProducts(data.products || []);
                        setTotal(data.total || 0);
                        setPages(data.pages || 1);
                    }
                } else {
                    setError(data.message || 'Failed to fetch search results');
                }
            } catch (err) {
                setError('Failed to fetch search results');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [q, hasQuery, page, selectedCategory, priceRange.min, priceRange.max, sort]);

    // Derived data for filters (based on currently loaded page)
    const categories = useMemo(() => {
        const cats = products.map(p => p.category).filter(Boolean);
        return [...new Set(cats)];
    }, [products]);

    const handlePriceChange = (type, value) => {
        setPriceRange(prev => ({ ...prev, [type]: value }));
        setPage(1);
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        setPage(1);
    };

    const handleSortChange = (value) => {
        setSort(value);
        setPage(1);
    };

    return (
        <div className="search-page">
            <section className="search-hero">
                <div className="container">
                    <div className="search-hero-content">
                        <p className="search-badge">DISCOVER PRODUCTS</p>
                        <h1>
                            {hasQuery ? (
                                <>
                                    Search results for <span className="highlight">"{q}"</span>
                                </>
                            ) : (
                                'Discover our collection'
                            )}
                        </h1>
                        <p className="subtitle">
                            {hasQuery
                                ? `Showing ${total} ${total === 1 ? 'match' : 'matches'} for your search criteria.`
                                : 'Explore our wide range of premium electronics and accessories.'}
                        </p>
                    </div>
                </div>
            </section>

            <section className="search-results-section">
                <div className="container">
                    {hasQuery && (
                        <button
                            className="mobile-filter-toggle"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <SlidersHorizontal size={16} />
                            {isFilterOpen ? 'Hide Filters' : 'Filters'}
                            {isFilterOpen && <X size={14} style={{ marginLeft: 'auto' }} />}
                        </button>
                    )}
                    <div className="search-container">
                        {hasQuery && (
                            <div className={`filter-sidebar-wrap ${isFilterOpen ? 'filter-open' : ''}`}>
                                <SearchFilters
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    onCategoryChange={handleCategoryChange}
                                    priceRange={priceRange}
                                    onPriceChange={handlePriceChange}
                                    sort={sort}
                                    onSortChange={handleSortChange}
                                />
                            </div>
                        )}

                        <main className="search-main">
                            {hasQuery && !loading && (
                                <div className="search-controls">
                                    <div className="results-count">
                                        Showing <span>{products.length}</span> of <span>{total}</span> products
                                    </div>
                                    <div className="sort-wrapper">
                                        <label>Sort by:</label>
                                        <select value={sort} onChange={(e) => setSort(e.target.value)}>
                                            <option value="newest">Newest Arrivals</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="name-asc">Name: A-Z</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {loading && hasQuery ? (
                                <div className="product-grid">
                                    {[...Array(6)].map((_, i) => (
                                        <SkeletonProduct key={i} />
                                    ))}
                                </div>
                            ) : error && hasQuery ? (
                                <div className="search-state center error">
                                    <i className="fas fa-exclamation-circle"></i>
                                    <p>{error}</p>
                                </div>
                            ) : hasQuery && products.length === 0 ? (
                                <div className="search-state center empty animate-in">
                                    <div className="icon-wrapper">
                                        <i className="fas fa-search"></i>
                                    </div>
                                    <h3>No matches found</h3>
                                    <p>We couldn't find any products matching your filters. Try adjusting your search or filters.</p>
                                    <button onClick={() => {
                                        setSelectedCategory('');
                                        setPriceRange({ min: '', max: '' });
                                    }} className="btn-primary">CLEAR FILTERS</button>
                                </div>
                            ) : hasQuery ? (
                                <div className="product-grid">
                                    {products.map((product, index) => (
                                        <div key={product._id} className={`animate-in stagger-${(index % 6) + 1}`}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="search-state center animate-in">
                                    <div className="icon-wrapper">
                                        <i className="fas fa-shopping-bag"></i>
                                    </div>
                                    <h3>Explore CaseProz</h3>
                                    <p>Use the search bar above to find your favorite products instantly.</p>
                                    <Link to="/" className="btn-primary">START BROWSING</Link>
                                </div>
                            )}

                            {hasQuery && !loading && total > 0 && pages > 1 && (
                                <nav
                                    className="pagination"
                                    aria-label="Search results pages"
                                    style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={page === 1}
                                        style={{
                                            padding: '8px 14px',
                                            borderRadius: '999px',
                                            border: '1px solid #e5e7eb',
                                            backgroundColor: page === 1 ? '#f9fafb' : '#ffffff',
                                            color: '#374151',
                                            fontSize: '13px',
                                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        Previous
                                    </button>
                                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                                        Page <strong>{page}</strong> of <strong>{pages}</strong>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                                        disabled={page === pages}
                                        style={{
                                            padding: '8px 14px',
                                            borderRadius: '999px',
                                            border: '1px solid #e5e7eb',
                                            backgroundColor: page === pages ? '#f9fafb' : '#ffffff',
                                            color: '#374151',
                                            fontSize: '13px',
                                            cursor: page === pages ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        Next
                                    </button>
                                </nav>
                            )}
                        </main>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Search;
