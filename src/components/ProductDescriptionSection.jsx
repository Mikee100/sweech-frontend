import React from 'react';


const ProductDescriptionSection = ({ html, specs }) => {
    if (!html && (!specs || (Array.isArray(specs) ? specs.length === 0 : Object.keys(specs).length === 0))) return null;

    return (
        <section className="pd-description-section">
            {html && <>
                <h2 className="pd-description-heading">Description</h2>
                <div
                    className="pd-description"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </>}

            {specs && (Array.isArray(specs) ? specs.length > 0 : Object.keys(specs).length > 0) && (
                <div className="pd-specs-section-inside">
                    <h3 className="pd-specs-title">Specifications</h3>
                    <div className="pd-specs-table-wrapper">
                        <table className="pd-specs-table">
                            <tbody>
                                {Array.isArray(specs)
                                    ? specs
                                          .filter(
                                              (item) =>
                                                  item && typeof item === 'object' &&
                                                  (item.key || item.label) && (item.value || item.val)
                                          )
                                          .map((item, idx) => (
                                              <tr key={idx}>
                                                  <td className="pd-specs-key">{item.key || item.label}</td>
                                                  <td className="pd-specs-value">{item.value || item.val}</td>
                                              </tr>
                                          ))
                                    : Object.entries(specs)
                                          .filter(([key]) => isNaN(Number(key)))
                                          .map(([key, value]) => (
                                              <tr key={key}>
                                                  <td className="pd-specs-key">{key}</td>
                                                  <td className="pd-specs-value">{value}</td>
                                              </tr>
                                          ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProductDescriptionSection;

