import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../constants/categories';

const toList = (value) => {
    if (!value) return [];
    return String(value)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
};

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
    const [categoriesText, setCategoriesText] = useState('');
    const [sku, setSku] = useState('');
    const [brand, setBrand] = useState('');
    const [variantGroup, setVariantGroup] = useState('');
    const [variantLabel, setVariantLabel] = useState('');
    const [featureHeadline, setFeatureHeadline] = useState('');
    const [featureSubtext, setFeatureSubtext] = useState('');
    const [notes, setNotes] = useState([]);
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState('');
    const [onSale, setOnSale] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [keyFeatures, setKeyFeatures] = useState([]);
    const [specs, setSpecs] = useState([]);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [slugOverride, setSlugOverride] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const descriptionEditorRef = useRef(null);

    const subCategoryOptions = useMemo(() => {
        if (!category) return [];
        return CATEGORIES?.[category] || [];
    }, [category]);

    useEffect(() => {
        if (!isEditMode) return;

        const fetchProduct = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/id/${id}`);
                if (!response.ok) throw new Error('Product not found');
                const product = await response.json();

                setName(product.name || '');
                setPrice(Number(product.price || 0));
                setOriginalPrice(Number(product.originalPrice || 0));
                setImage(product.images?.[0] || '');
                setImages(product.images || []);
                setCategory(product.category || '');
                setSubCategory(product.subCategory || '');
                setCategoriesText((product.categories || []).join(', '));
                setSku(product.sku || '');
                setBrand(product.brand || '');
                setVariantGroup(product.variantGroup || '');
                setVariantLabel(product.variantLabel || '');
                setFeatureHeadline(product.featureHeadline || '');
                setFeatureSubtext(product.featureSubtext || '');
                setNotes(product.notes || []);
                setStock(Number(product.stock || 0));
                setDescription(product.description || '');
                setOnSale(Boolean(product.onSale));
                setIsFeatured(Boolean(product.isFeatured));
                setKeyFeatures(product.keyFeatures || []);
                setSpecs(product.specs || []);
                setIsActive(
                    product.isActive === undefined || product.isActive === null
                        ? true
                        : Boolean(product.isActive)
                );
                setMetaTitle(product.metaTitle || '');
                setMetaDescription(product.metaDescription || '');
                setSlugOverride(product.slug || '');
            } catch (err) {
                setError('Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, isEditMode]);

    const uploadFileHandler = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        setUploading(true);

        try {
            const uploadedUrls = [];

            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) continue;
                const url = await response.text();
                uploadedUrls.push(url);
            }

            if (uploadedUrls.length) {
                // Use the first uploaded image as the main URL field
                setImage((prev) => prev || uploadedUrls[0]);
                setImages((prev) => [...prev, ...uploadedUrls]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
            // Allow selecting the same file(s) again by resetting the input
            e.target.value = '';
        }
    };

    const addKeyFeatureHandler = () => setKeyFeatures([...keyFeatures, '']);
    const removeKeyFeatureHandler = (index) => setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
    const keyFeatureChangeHandler = (index, value) => {
        const next = [...keyFeatures];
        next[index] = value;
        setKeyFeatures(next);
    };

    const addSpecHandler = () => setSpecs([...specs, { key: '', value: '' }]);
    const removeSpecHandler = (index) => setSpecs(specs.filter((_, i) => i !== index));
    const specChangeHandler = (index, field, value) => {
        const next = [...specs];
        next[index][field] = value;
        setSpecs(next);
    };

    const addNoteHandler = () => setNotes([...notes, '']);
    const removeNoteHandler = (index) => setNotes(notes.filter((_, i) => i !== index));
    const noteChangeHandler = (index, value) => {
        const next = [...notes];
        next[index] = value;
        setNotes(next);
    };

    const addImageUrlHandler = () => {
        const url = image.trim();
        if (!url) return;
        setImages((prev) => [...prev, url]);
        // If no main image is set yet, use this as the main one
        setImage('');
    };

    const moveImage = (index, direction) => {
        setImages((prev) => {
            const next = [...prev];
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= next.length) return prev;
            const temp = next[index];
            next[index] = next[newIndex];
            next[newIndex] = temp;
            return next;
        });
    };

    const execDescriptionCommand = (command, value = null) => {
        if (!descriptionEditorRef.current) return;
        descriptionEditorRef.current.focus();
        document.execCommand(command, false, value);
        setDescription(descriptionEditorRef.current.innerHTML);
    };

    const handleDescriptionInput = () => {
        if (!descriptionEditorRef.current) return;
        setDescription(descriptionEditorRef.current.innerHTML);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const slugSource = slugOverride && slugOverride.trim().length > 0 ? slugOverride : name;
        const slug = slugSource
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        const productData = {
            name,
            slug,
            price,
            originalPrice,
            images: images.length > 0 ? images : [image].filter(Boolean),
            category,
            subCategory,
            categories: toList(categoriesText),
            sku,
            brand,
            variantGroup,
            variantLabel,
            featureHeadline,
            featureSubtext,
            notes,
            stock,
            description,
            onSale,
            isFeatured,
            isActive,
            keyFeatures,
            specs,
            metaTitle,
            metaDescription,
        };

        try {
            const url = isEditMode
                ? `${import.meta.env.VITE_API_URL}/api/products/${id}`
                : `${import.meta.env.VITE_API_URL}/api/products`;
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
        setSubCategory('');
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
                    <p style={{ color: '#666', marginTop: '5px' }}>
                        Add the details that power the new product page (SKU, Brand, Categories, Hero banner, Notes).
                    </p>
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

            {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={submitHandler} style={styles.card}>
                {/* Basic Info Section */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}><i className="fas fa-info-circle" style={{ color: '#E41E26' }}></i> Basic Information</h2>
                <div style={{ marginBottom: '24px' }}>
                    <label style={styles.label}>Product Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Anker Soundcore Liberty 5..." style={styles.input} />
                </div>

                <div style={styles.row}>
                    <div>
                        <label style={styles.label}>URL Slug (optional override)</label>
                        <input
                            type="text"
                            value={slugOverride}
                            onChange={(e) => setSlugOverride(e.target.value)}
                            placeholder="e.g. anker-soundcore-liberty-5-white"
                            style={styles.input}
                        />
                        <div style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>
                            If left empty, the slug will be generated from the product name.
                        </div>
                    </div>
                    <div>
                        <label style={styles.label}>SEO Title (optional)</label>
                        <input
                            type="text"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            placeholder="Browser tab / search title"
                            style={styles.input}
                        />
                    </div>
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
                            <label style={styles.label}>Category (primary)</label>
                            <select value={category} onChange={handleCategoryChange} required style={styles.input}>
                                <option value="">Select Category</option>
                                {Object.keys(CATEGORIES).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={styles.label}>Subcategory</label>
                            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} style={styles.input} disabled={!category}>
                                <option value="">{category ? 'Select Subcategory' : 'Select category first'}</option>
                                {subCategoryOptions.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div>
                            <label style={styles.label}>SKU</label>
                            <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. A3957H31" style={styles.input} />
                        </div>
                        <div>
                            <label style={styles.label}>Brand</label>
                            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Soundcore by Anker" style={styles.input} />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div>
                            <label style={styles.label}>Variant Group ID (for color/size family)</label>
                            <input
                                type="text"
                                value={variantGroup}
                                onChange={(e) => setVariantGroup(e.target.value)}
                                placeholder="e.g. liberty-5"
                                style={styles.input}
                            />
                            <div style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>
                                Use the same group ID for all colorways (e.g. Liberty 5 White & Black).
                            </div>
                        </div>
                        <div>
                            <label style={styles.label}>Variant Label</label>
                            <input
                                type="text"
                                value={variantLabel}
                                onChange={(e) => setVariantLabel(e.target.value)}
                                placeholder="e.g. White"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '0' }}>
                        <label style={styles.label}>Extra Categories / Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={categoriesText}
                            onChange={(e) => setCategoriesText(e.target.value)}
                            placeholder="e.g. Earphones, Valentine's Day Gifts"
                            style={styles.input}
                        />
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                            These show in the product footer as “Categories: …” (in addition to Category/Subcategory).
                        </div>
                    </div>
                </div>

                {/* Inventory & Status */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}><i className="fas fa-warehouse" style={{ color: '#E41E26' }}></i> Inventory & Status</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '24px' }}>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '30px' }}>
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor="isActive" style={{ fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Active (visible)</label>
                        </div>
                    </div>
                </div>

                {/* Hero text */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}><i className="fas fa-bullhorn" style={{ color: '#E41E26' }}></i> Hero Banner Text</h2>
                    <div style={styles.row}>
                        <div>
                            <label style={styles.label}>Hero Headline</label>
                            <input type="text" value={featureHeadline} onChange={(e) => setFeatureHeadline(e.target.value)} placeholder="e.g. 67% Faster Recharging" style={styles.input} />
                        </div>
                        <div>
                            <label style={styles.label}>Hero Subtext</label>
                            <input type="text" value={featureSubtext} onChange={(e) => setFeatureSubtext(e.target.value)} placeholder="e.g. 30W Max Input" style={styles.input} />
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ ...styles.sectionTitle, margin: 0 }}><i className="fas fa-sticky-note" style={{ color: '#E41E26' }}></i> Notes (below main image)</h2>
                        <button type="button" onClick={addNoteHandler} style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Add Note</button>
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {notes.map((note, index) => (
                            <div key={index} style={{ display: 'flex', gap: '12px' }}>
                                <input type="text" placeholder="Note text..." value={note} onChange={(e) => noteChangeHandler(index, e.target.value)} style={styles.input} />
                                <button type="button" onClick={() => removeNoteHandler(index)} style={{ padding: '12px', color: '#E41E26', cursor: 'pointer', border: 'none', background: 'none' }}><i className="fas fa-trash-alt"></i></button>
                            </div>
                        ))}
                        {notes.length === 0 && (
                            <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                Optional. Use this for disclaimers or comparison notes like the Sweech example.
                            </div>
                        )}
                    </div>
                </div>

                {/* Media Section */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}><i className="fas fa-images" style={{ color: '#E41E26' }}></i> Product Media</h2>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={styles.label}>Upload or Link Images</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Paste Image URL" style={{ ...styles.input, flex: 1 }} />
                            <button
                                type="button"
                                onClick={addImageUrlHandler}
                                style={{
                                    padding: '0 18px',
                                    backgroundColor: '#f3f4f6',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                ADD URL
                            </button>
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
                                <input type="file" multiple onChange={uploadFileHandler} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>
                    {images.length > 0 && (
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '12px' }}>
                            {images.map((img, i) => (
                                <div key={i} style={{ position: 'relative', width: '90px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ddd', backgroundColor: '#fff' }}>
                                    <img src={img} alt="" style={{ width: '100%', height: '70px', objectFit: 'cover' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button
                                                type="button"
                                                onClick={() => moveImage(i, -1)}
                                                disabled={i === 0}
                                                title="Move up"
                                                style={{
                                                    border: 'none',
                                                    background: 'transparent',
                                                    cursor: i === 0 ? 'default' : 'pointer',
                                                    color: i === 0 ? '#d1d5db' : '#6b7280',
                                                    fontSize: '11px',
                                                }}
                                            >
                                                ↑
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveImage(i, 1)}
                                                disabled={i === images.length - 1}
                                                title="Move down"
                                                style={{
                                                    border: 'none',
                                                    background: 'transparent',
                                                    cursor: i === images.length - 1 ? 'default' : 'pointer',
                                                    color: i === images.length - 1 ? '#d1d5db' : '#6b7280',
                                                    fontSize: '11px',
                                                }}
                                            >
                                                ↓
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#dc2626',
                                                cursor: 'pointer',
                                                fontSize: '11px',
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Description & Details */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}><i className="fas fa-align-left" style={{ color: '#E41E26' }}></i> Description</h2>
                    <div style={{ marginBottom: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => execDescriptionCommand('bold')} style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontWeight: '700' }}>B</button>
                        <button type="button" onClick={() => execDescriptionCommand('italic')} style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontStyle: 'italic' }}>I</button>
                        <button type="button" onClick={() => execDescriptionCommand('insertUnorderedList')} style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer' }}>• List</button>
                        <button type="button" onClick={() => execDescriptionCommand('insertOrderedList')} style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer' }}>1. List</button>
                        <button type="button" onClick={() => execDescriptionCommand('formatBlock', 'H4')} style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontWeight: '600' }}>H</button>
                        <button type="button" onClick={() => execDescriptionCommand('formatBlock', 'BLOCKQUOTE')} style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer' }}>&ldquo; Quote</button>
                        <button
                            type="button"
                            onClick={() => {
                                const url = window.prompt('Image URL');
                                if (url) {
                                    execDescriptionCommand('insertImage', url);
                                }
                            }}
                            style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer' }}
                        >
                            Img
                        </button>
                        <button type="button" onClick={() => execDescriptionCommand('removeFormat')} style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', cursor: 'pointer', color: '#b91c1c' }}>Clear</button>
                    </div>
                    <div
                        ref={descriptionEditorRef}
                        contentEditable
                        onInput={handleDescriptionInput}
                        dangerouslySetInnerHTML={{ __html: description }}
                        style={{
                            ...styles.input,
                            minHeight: '160px',
                            lineHeight: 1.5,
                            overflowY: 'auto'
                        }}
                        placeholder="Describe your product, add sections like “From the Manufacturer”, lists, etc."
                    />
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
                                <input type="text" placeholder="Highlight point (e.g. Real-Time Adaptive Noise Canceling)" value={feature} onChange={(e) => keyFeatureChangeHandler(index, e.target.value)} style={styles.input} />
                                <button type="button" onClick={() => removeKeyFeatureHandler(index)} style={{ padding: '12px', color: '#E41E26', cursor: 'pointer', border: 'none', background: 'none' }}><i className="fas fa-trash-alt"></i></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Specs Section */}
                {/* SEO meta description */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}><i className="fas fa-search" style={{ color: '#E41E26' }}></i> SEO Description</h2>
                    <textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Short description for search engines and link previews."
                        style={{
                            ...styles.input,
                            minHeight: '90px',
                            resize: 'vertical',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ ...styles.sectionTitle, margin: 0 }}><i className="fas fa-list-ul" style={{ color: '#E41E26' }}></i> Technical Specs</h2>
                        <button type="button" onClick={addSpecHandler} style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Add Specification</button>
                    </div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {specs.map((spec, index) => (
                            <div key={index} style={{ display: 'flex', gap: '12px' }}>
                                <input type="text" placeholder="Spec Key (e.g. Bluetooth Version)" value={spec.key} onChange={(e) => specChangeHandler(index, 'key', e.target.value)} style={{ ...styles.input, flex: 1 }} />
                                <input type="text" placeholder="Spec Value (e.g. 5.4)" value={spec.value} onChange={(e) => specChangeHandler(index, 'value', e.target.value)} style={{ ...styles.input, flex: 1 }} />
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

