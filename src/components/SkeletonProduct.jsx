import React from 'react';

const SkeletonProduct = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton skeleton-img"></div>
            <div className="skeleton skeleton-text short"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-price"></div>
            <div className="skeleton skeleton-btn"></div>
        </div>
    );
};

export default SkeletonProduct;
