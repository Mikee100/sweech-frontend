import React from 'react';

const ProductDescriptionSection = ({ html }) => {
    if (!html) return null;

    return (
        <section className="pd-description-section">
            <h2 className="pd-description-heading">Description</h2>
            <div
                className="pd-description"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </section>
    );
};

export default ProductDescriptionSection;

