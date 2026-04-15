import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/apiClient';

const CategoryModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('');
    const [categoriesData, setCategoriesData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await apiFetch(`${import.meta.env.VITE_API_URL}/api/categories`);
                const data = Array.isArray(res.data) ? res.data : res;
                
                const formatted = {};
                data.forEach(cat => {
                    formatted[cat.name] = (cat.subCategories || []).map(sub => sub.name);
                });
                
                setCategoriesData(formatted);
                if (data.length > 0 && !activeTab) {
                    setActiveTab(data[0].name);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [isOpen]);

    if (!isOpen) return null;

    const categoryNames = Object.keys(categoriesData);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="category-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                <div className="modal-grid">
                    <div className="modal-sidebar">
                        <h2 className="sidebar-title">Categories</h2>
                        {loading && <p style={{ padding: '0 20px', fontSize: '14px', color: '#666' }}>Loading...</p>}
                        <ul className="sidebar-tabs">
                            {categoryNames.map(cat => (
                                <li
                                    key={cat}
                                    className={activeTab === cat ? 'active' : ''}
                                    onMouseEnter={() => setActiveTab(cat)}
                                    onClick={() => setActiveTab(cat)}
                                >
                                    {cat} <i className="fas fa-chevron-right"></i>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="modal-content">
                        <h2 className="content-title">{activeTab || 'Select a category'}</h2>
                        <div className="subcategory-grid">
                            {activeTab && categoriesData[activeTab] && categoriesData[activeTab].map(sub => (
                                <a 
                                    href={`/category/${sub.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} 
                                    key={sub} 
                                    className="subcategory-link"
                                    onClick={onClose}
                                >
                                    {sub}
                                </a>
                            ))}
                            {activeTab && (!categoriesData[activeTab] || categoriesData[activeTab].length === 0) && (
                                <p style={{ color: '#999', fontSize: '14px' }}>No subcategories found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;
