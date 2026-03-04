import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../constants/categories';

const ProductEdit = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [originalPrice, setOriginalPrice] = useState(0);
    const [image, setImage] = useState('');
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState('');
    const [onSale, setOnSale] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [keyFeatures, setKeyFeatures] = useState([]);
    const [specs, setSpecs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`http://localhost:5000/api/products/id/${id}`);
                    if (!response.ok) throw new Error('Product not found');
                    const product = await response.json();

                    setName(product.name);
                    setPrice(product.price);
                    setOriginalPrice(product.originalPrice || 0);
                    setImage(product.images[0] || '');
                    setImages(product.images || []);
                    setCategory(product.category);
                    setSubCategory(product.subCategory || '');
                    setStock(product.stock);
                    setDescription(product.description);
                    setOnSale(product.onSale || false);
                    setIsFeatured(product.isFeatured || false);
                    setKeyFeatures(product.keyFeatures || []);
                    setSpecs(product.specs || []);
                } catch (err) {
                    setError('Failed to fetch product');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.text();
            setImage(data);
            setImages(prev => [...prev, data]);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const addKeyFeatureHandler = () => {
        setKeyFeatures([...keyFeatures, '']);
    };

    const removeKeyFeatureHandler = (index) => {
        setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
    };

    const keyFeatureChangeHandler = (index, value) => {
        const newFeatures = [...keyFeatures];
        newFeatures[index] = value;
        setKeyFeatures(newFeatures);
    };

    const addSpecHandler = () => {
        setSpecs([...specs, { key: '', value: '' }]);
    };

    const removeSpecHandler = (index) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    const specChangeHandler = (index, field, value) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const productData = {
            name,
            slug,
            price,
            originalPrice,
            images: images.length > 0 ? images : [image],
            category,
            subCategory,
            stock,
            description,
            onSale,
            isFeatured,
            keyFeatures,
            specs
        };

        try {
            const url = isEditMode
                ? `http://localhost:5000/api/products/${id}`
                : `http://localhost:5000/api/products`;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                navigate('/admin/productlist');
            } else {
                const data = await response.json();
                setError(data.message || 'Operation failed');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setSubCategory(''); // Reset subcategory when category changes
    };

    const styles = {
        card: {
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid #eee'
        },
        label: {
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: '#333',
            fontSize: '14px'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #e0e0e0',
            fontSize: '15px',
            transition: 'border-color 0.3s',
            outline: 'none'
        },
        row: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px'
        },
        sectionTitle: {
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }
    };

    return (
        <div className="admin-product-edit">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
                        {isEditMode ? 'Edit Product' : 'Create New Product'}
                    </h1>
                    <p style={{ color: '#666', marginTop: '5px' }}>Fill in the details below to {isEditMode ? 'update' : 'add'} your product.</p>
                </div>
                <Link to="/admin/productlist" style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    textDecoration: 'none',
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: '600'
                }}>
                    Cancel
                </Link>
            </div>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

            <form onSubmit={submitHandler} style={styles.card}>
                {/* Basic Info Section */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}><i className="fas fa-info-circle" style={{ color: '#E41E26' }}></i> Basic Information</h2>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={styles.label}>Product Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. EcoFlow RIVER 2 Max" style={styles.input} />
                    </div>

                    <div style={styles.row}>
                        <div>
                            <label style={styles.label}>Sale Price (KSh)</label>
                            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required style={styles.input} />
                        </div>
                        <div>
                            <label style={styles.label}>Original Price (KSh)</label>
                            <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} style={styles.input} />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div>
                            <label style={styles.label}>Category</label>
                            <select value={category} onChange={handleCategoryChange} required style={styles.input}>
                                <option value="">Select Category</option>
                                {Object.keys(CATEGORIES).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={styles.label}>Subcategory</label>
                            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required style={styles.input} disabled={!category}>
                                <option value="">Select Subcategory</option>
                                {category && CATEGORIES[category].map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Inventory & Status */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}><i className="fas fa-warehouse" style={{ color: '#E41E26' }}></i> Inventory & Status</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={styles.label}>Stock Quantity</label>
                            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} required style={styles.input} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '30px' }}>
                            <input type="checkbox" id="onSale" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                            <label htmlFor="onSale" style={{ fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>On Sale</label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '30px' }}>
                            <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                            <label htmlFor="isFeatured" style={{ fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Featured Product</label>
                        </div>
                    </div>
                </div>

                {/* Media Section */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}><i className="fas fa-images" style={{ color: '#E41E26' }}></i> Product Media</h2>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={styles.label}>Upload or Link Images</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Paste Image URL" style={{ ...styles.input, flex: 1 }} />
                            <label style={{
                                padding: '0 25px',
                                backgroundColor: '#1a1a1a',
                                color: 'white',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {uploading ? 'UPLOADING...' : 'UPLOAD'}
                                <input type="file" onChange={uploadFileHandler} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>
                    {images.length > 0 && (
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '12px' }}>
                            {images.map((img, i) => (
                                <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        border: 'none',
                                        background: 'rgba(228, 30, 38, 0.9)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Description & Details */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}><i className="fas fa-align-left" style={{ color: '#E41E26' }}></i> Description</h2>
                    <textarea rows="6" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe your product in detail..." style={{ ...styles.input, resize: 'vertical' }}></textarea>
                </div>

                {/* Key Features Section */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ ...styles.sectionTitle, margin: 0 }}><i className="fas fa-star" style={{ color: '#E41E26' }}></i> Key Highlights</h2>
                        <button type="button" onClick={addKeyFeatureHandler} style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Add Feature</button>
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {keyFeatures.map((feature, index) => (
                            <div key={index} style={{ display: 'flex', gap: '12px' }}>
                                <input type="text" placeholder="Highlight point (e.g. 5000mAh Long Battery Life)" value={feature} onChange={(e) => keyFeatureChangeHandler(index, e.target.value)} style={styles.input} />
                                <button type="button" onClick={() => removeKeyFeatureHandler(index)} style={{ padding: '12px', color: '#E41E26', cursor: 'pointer', border: 'none', background: 'none' }}><i className="fas fa-trash-alt"></i></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Specs Section */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ ...styles.sectionTitle, margin: 0 }}><i className="fas fa-list-ul" style={{ color: '#E41E26' }}></i> Technical Specs</h2>
                        <button type="button" onClick={addSpecHandler} style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Add Specification</button>
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {specs.map((spec, index) => (
                            <div key={index} style={{ display: 'flex', gap: '12px' }}>
                                <input type="text" placeholder="Spec Key (e.g. Weight)" value={spec.key} onChange={(e) => specChangeHandler(index, 'key', e.target.value)} style={{ ...styles.input, flex: 1 }} />
                                <input type="text" placeholder="Spec Value (e.g. 250g)" value={spec.value} onChange={(e) => specChangeHandler(index, 'value', e.target.value)} style={{ ...styles.input, flex: 1 }} />
                                <button type="button" onClick={() => removeSpecHandler(index)} style={{ padding: '12px', color: '#E41E26', cursor: 'pointer', border: 'none', background: 'none' }}><i className="fas fa-trash-alt"></i></button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '18px',
                        backgroundColor: '#E41E26',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '800',
                        fontSize: '18px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 5px 20px rgba(228, 30, 38, 0.3)',
                        transition: 'all 0.3s'
                    }}
                >
                    {loading ? 'PROCESSING...' : isEditMode ? 'UPDATE PRODUCT' : 'PUBLISH PRODUCT'}
                </button>
            </form>
        </div>
    );
};

export default ProductEdit;
