import React from 'react';

const SearchFilters = ({ categories, selectedCategory, onCategoryChange, priceRange, onPriceChange, sort, onSortChange }) => {
    return (
        <aside className="filter-sidebar">
            <div className="filter-section">
                <h3 className="filter-title">Sort By</h3>
                <div className="sort-wrapper">
                    <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
                        <option value="newest">Newest Arrivals</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name-asc">Name: A-Z</option>
                    </select>
                </div>
            </div>

            <div className="filter-section">
                <h3 className="filter-title">Categories</h3>
                <div className="filter-list">
                    <label className="filter-item">
                        <input
                            type="checkbox"
                            checked={selectedCategory === ''}
                            onChange={() => onCategoryChange('')}
                        />
                        All Categories
                    </label>
                    {categories.map(cat => (
                        <label key={cat} className="filter-item">
                            <input
                                type="checkbox"
                                checked={selectedCategory === cat}
                                onChange={() => onCategoryChange(cat)}
                            />
                            {cat}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <h3 className="filter-title">Price Range</h3>
                <div className="price-range">
                    <div className="price-inputs">
                        <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => onPriceChange('min', e.target.value)}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => onPriceChange('max', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SearchFilters;
