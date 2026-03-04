import React, { useState } from 'react';

const CategoryModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('Electronics');

    const categories = {
        'Electronics': [
            'Smartphones', 'Laptops', 'Tablets', 'Monitors', 'Audio', 'Cameras'
        ],
        'Accessories': [
            'Cables', 'Cases', 'Chargers', 'Screen Protectors', 'Adapters'
        ],
        'Wearables': [
            'Smart Watches', 'Fitness Trackers', 'Bands'
        ],
        'Computers': [
            'Desktops', 'Printers', 'Storage', 'Software'
        ],
        'Home': [
            'Smart Home', 'Kitchen Appliances', 'Security'
        ]
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="category-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                <div className="modal-grid">
                    <div className="modal-sidebar">
                        <h2 className="sidebar-title">Categories</h2>
                        <ul className="sidebar-tabs">
                            {Object.keys(categories).map(cat => (
                                <li
                                    key={cat}
                                    className={activeTab === cat ? 'active' : ''}
                                    onMouseEnter={() => setActiveTab(cat)}
                                >
                                    {cat} <i className="fas fa-chevron-right"></i>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="modal-content">
                        <h2 className="content-title">{activeTab}</h2>
                        <div className="subcategory-grid">
                            {categories[activeTab].map(sub => (
                                <a href={`/category/${sub.toLowerCase().replace(' ', '-')}`} key={sub} className="subcategory-link">
                                    {sub}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;
