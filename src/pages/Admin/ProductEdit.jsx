import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, ApiError } from '../../utils/apiClient';
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
    
    // UI State
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        hero: false,
        notes: false,
        highlights: false,
        specs: false,
        seo: false
    });

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
                const product = await apiFetch(`${import.meta.env.VITE_API_URL}/api/products/id/${id}`);

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

                const url = await apiFetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
                    method: 'POST',
                    body: formData,
                }, { parseJson: false }); // Assuming upload returns plain text URL or JSON. Let's check apiFetch.
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

    const addNoteHandler = () => {
        setNotes([...notes, '']);
        setExpandedSections(prev => ({ ...prev, notes: true }));
    };
    const removeNoteHandler = (index) => setNotes(notes.filter((_, i) => i !== index));
    const noteChangeHandler = (index, value) => {
        const next = [...notes];
        next[index] = value;
        setNotes(next);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
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

    const insertDescriptionTemplate = (html) => {
        if (!descriptionEditorRef.current) {
            setDescription((prev) => `${prev}${html}`);
            return;
        }
        descriptionEditorRef.current.focus();
        document.execCommand('insertHTML', false, html);
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

            await apiFetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            navigate('/admin/productlist');
        } catch (err) {
            setError(err.message || 'Something went wrong');
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
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        collapsibleHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            cursor: 'pointer',
            marginBottom: '10px',
            border: '1px solid #eee',
            transition: 'background-color 0.2s'
        },
        collapsibleBody: {
            padding: '20px',
            border: '1px solid #eee',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            marginBottom: '20px',
            backgroundColor: '#fff'
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
                {/* 1. Basic Essentials */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}>
                        <i className="fas fa-star" style={{ color: '#E41E26' }}></i> 
                        Essential Details
                    </h2>
                    
                    <div style={{ marginBottom: '24px' }}>
                        <label style={styles.label}>Product Name *</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Anker Soundcore Liberty 5" style={styles.input} />
                    </div>

                    <div style={styles.row}>
                        <div>
                            <label style={styles.label}>Category *</label>
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
                            <label style={styles.label}>Price (KSh) *</label>
                            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required style={styles.input} />
                        </div>
                        <div>
                            <label style={styles.label}>Original Price (KSh) - <span style={{ fontWeight: 'normal', color: '#666' }}>optional</span></label>
                            <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} style={styles.input} />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div>
                            <label style={styles.label}>Stock Quantity *</label>
                            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} required style={styles.input} />
                        </div>
                        <div style={{ display: 'flex', gap: '20px', paddingTop: '35px' }}>
                           <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                               <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                               Active
                           </label>
                           <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                               <input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                               On Sale
                           </label>
                           <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                               <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                               Featured
                           </label>
                        </div>
                    </div>
                </div>

                {/* 2. Media Section */}
                <div style={{ marginBottom: '40px', padding: '25px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <h2 style={{ ...styles.sectionTitle, marginBottom: '15px' }}>
                        <i className="fas fa-images" style={{ color: '#E41E26' }}></i> 
                        Product Media
                    </h2>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Paste Image URL" style={{ ...styles.input, flex: 1, backgroundColor: 'white' }} />
                            <button
                                type="button"
                                onClick={addImageUrlHandler}
                                style={{
                                    padding: '0 18px',
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
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
                                {uploading ? '...' : 'UPLOAD'}
                                <input type="file" multiple onChange={uploadFileHandler} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>
                    {images.length > 0 && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {images.map((img, i) => (
                                <div key={i} style={{ position: 'relative', width: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', backgroundColor: '#fff' }}>
                                    <img src={img} alt="" style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            backgroundColor: 'rgba(228, 30, 38, 0.8)',
                                            color: 'white',
                                            border: 'none',
                                            width: '20px',
                                            height: '20px',
                                            fontSize: '10px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Product Grouping (Variants) */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}>
                        <i className="fas fa-layer-group" style={{ color: '#E41E26' }}></i> 
                        Product Family & Variants
                    </h2>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px', marginTop: '-10px' }}>
                        Connect different colors/sizes of the same product.
                    </p>
                    <div style={styles.row}>
                        <div>
                            <label style={styles.label}>Family Name (Link Variants)</label>
                            <input
                                type="text"
                                value={variantGroup}
                                onChange={(e) => setVariantGroup(e.target.value)}
                                placeholder="e.g. liberty-5"
                                style={styles.input}
                            />
                            <div style={{ marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>
                                Use the <strong>same name</strong> for all options (e.g. "liberty-5" for both Black and White models).
                            </div>
                        </div>
                        <div>
                            <label style={styles.label}>Variation Type (e.g. Color)</label>
                            <input
                                type="text"
                                value={variantLabel}
                                onChange={(e) => setVariantLabel(e.target.value)}
                                placeholder="e.g. White"
                                style={styles.input}
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Brand & SKU */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={styles.row}>
                        <div>
                            <label style={styles.label}>Brand</label>
                            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Soundcore" style={styles.input} />
                        </div>
                        <div>
                            <label style={styles.label}>SKU (Optional)</label>
                            <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. SC-LIB5-WHT" style={styles.input} />
                        </div>
                    </div>
                </div>

                {/* 5. Description */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={styles.sectionTitle}><i className="fas fa-align-left" style={{ color: '#E41E26' }}></i> Full Description</h2>
                    <div style={{ marginBottom: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {/* Editor Toolbar */}
                        <button type="button" onClick={() => execDescriptionCommand('bold')} style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #eee', cursor: 'pointer', fontWeight: '700' }}>B</button>
                        <button type="button" onClick={() => execDescriptionCommand('italic')} style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #eee', cursor: 'pointer', fontStyle: 'italic' }}>I</button>
                        <button type="button" onClick={() => execDescriptionCommand('insertUnorderedList')} style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #eee', cursor: 'pointer' }}>• List</button>
                        <span style={{ width: '1px', backgroundColor: '#eee', margin: '0 5px' }} />
                        <button type="button" onClick={() => insertDescriptionTemplate('<h4>Specifications</h4><ul><li>Detail 1</li><li>Detail 2</li></ul>')} style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '999px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer' }}>+ Add Specs List</button>
                    </div>
                    <div
                        ref={descriptionEditorRef}
                        contentEditable
                        onInput={handleDescriptionInput}
                        dangerouslySetInnerHTML={{ __html: description }}
                        style={{
                            ...styles.input,
                            minHeight: '200px',
                            lineHeight: 1.6,
                            overflowY: 'auto',
                            backgroundColor: '#fff'
                        }}
                        placeholder="Detailed product story and features..."
                    />
                </div>

                {/* Optional / Advanced Sections */}
                <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '30px', marginTop: '50px' }}>
                    <div 
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            cursor: 'pointer',
                            color: showAdvanced ? '#E41E26' : '#666',
                            marginBottom: '25px'
                        }}
                    >
                        <i className={`fas fa-chevron-${showAdvanced ? 'down' : 'right'}`}></i>
                        <span style={{ fontWeight: '800', fontSize: '16px' }}>
                            {showAdvanced ? 'HIDE OPTIONAL SECTIONS' : 'SHOW OPTIONAL SECTIONS (Notes, SEO, Specs, etc.)'}
                        </span>
                    </div>

                    {showAdvanced && (
                        <div style={{ display: 'grid', gap: '15px' }}>
                            
                            {/* Notes Accordion */}
                            <div>
                                <div style={styles.collapsibleHeader} onClick={() => toggleSection('notes')}>
                                    <span style={{ fontWeight: '600' }}><i className="fas fa-sticky-note" style={{ color: '#E41E26', marginRight: '8px' }}></i> Product Notes (e.g. Disclaimers)</span>
                                    <i className={`fas fa-chevron-${expandedSections.notes ? 'up' : 'down'}`}></i>
                                </div>
                                {expandedSections.notes && (
                                    <div style={styles.collapsibleBody}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Small notes shown at the top of the product page.</p>
                                            <button type="button" onClick={addNoteHandler} style={{ padding: '6px 12px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>+ Add Row</button>
                                        </div>
                                        <div style={{ display: 'grid', gap: '10px' }}>
                                            {notes.map((note, index) => (
                                                <div key={index} style={{ display: 'flex', gap: '10px' }}>
                                                    <input type="text" placeholder="e.g. This item is not returnable" value={note} onChange={(e) => noteChangeHandler(index, e.target.value)} style={styles.input} />
                                                    <button type="button" onClick={() => removeNoteHandler(index)} style={{ padding: '10px', color: '#E41E26', cursor: 'pointer', border: 'none', background: 'none' }}><i className="fas fa-times"></i></button>
                                                </div>
                                            ))}
                                            {notes.length === 0 && <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ddd', borderRadius: '8px', color: '#999', fontSize: '13px' }}>No notes added yet. Click "+ Add Row" to add one.</div>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Highlights Accordion */}
                            <div>
                                <div style={styles.collapsibleHeader} onClick={() => toggleSection('highlights')}>
                                    <span style={{ fontWeight: '600' }}><i className="fas fa-check-circle" style={{ color: '#E41E26', marginRight: '8px' }}></i> Key Highlights (Bullet points)</span>
                                    <i className={`fas fa-chevron-${expandedSections.highlights ? 'up' : 'down'}`}></i>
                                </div>
                                {expandedSections.highlights && (
                                    <div style={styles.collapsibleBody}>
                                        <button type="button" onClick={addKeyFeatureHandler} style={{ marginBottom: '15px', padding: '6px 12px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>+ Add Bullet Point</button>
                                        <div style={{ display: 'grid', gap: '10px' }}>
                                            {keyFeatures.map((feature, index) => (
                                                <div key={index} style={{ display: 'flex', gap: '10px' }}>
                                                    <input type="text" placeholder="e.g. 50-Hour Playtime" value={feature} onChange={(e) => keyFeatureChangeHandler(index, e.target.value)} style={styles.input} />
                                                    <button type="button" onClick={() => removeKeyFeatureHandler(index)} style={{ padding: '10px', color: '#E41E26', cursor: 'pointer', border: 'none', background: 'none' }}><i className="fas fa-times"></i></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Technical Specs Accordion */}
                            <div>
                                <div style={styles.collapsibleHeader} onClick={() => toggleSection('specs')}>
                                    <span style={{ fontWeight: '600' }}><i className="fas fa-list-ul" style={{ color: '#E41E26', marginRight: '8px' }}></i> Technical Specifications</span>
                                    <i className={`fas fa-chevron-${expandedSections.specs ? 'up' : 'down'}`}></i>
                                </div>
                                {expandedSections.specs && (
                                    <div style={styles.collapsibleBody}>
                                        <button type="button" onClick={addSpecHandler} style={{ marginBottom: '15px', padding: '6px 12px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>+ Add Spec Row</button>
                                        <div style={{ display: 'grid', gap: '10px' }}>
                                            {specs.map((spec, index) => (
                                                <div key={index} style={{ display: 'flex', gap: '10px' }}>
                                                    <input type="text" placeholder="Property (e.g. Weight)" value={spec.key} onChange={(e) => specChangeHandler(index, 'key', e.target.value)} style={{ ...styles.input, flex: 1 }} />
                                                    <input type="text" placeholder="Value (e.g. 250g)" value={spec.value} onChange={(e) => specChangeHandler(index, 'value', e.target.value)} style={{ ...styles.input, flex: 1 }} />
                                                    <button type="button" onClick={() => removeSpecHandler(index)} style={{ padding: '10px', color: '#E41E26', cursor: 'pointer', border: 'none', background: 'none' }}><i className="fas fa-times"></i></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* SEO & URL Accordion */}
                            <div>
                                <div style={styles.collapsibleHeader} onClick={() => toggleSection('seo')}>
                                    <span style={{ fontWeight: '600' }}><i className="fas fa-search" style={{ color: '#E41E26', marginRight: '8px' }}></i> Search Engine Optimization (SEO) & URL</span>
                                    <i className={`fas fa-chevron-${expandedSections.seo ? 'up' : 'down'}`}></i>
                                </div>
                                {expandedSections.seo && (
                                    <div style={styles.collapsibleBody}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={styles.label}>URL Slug Override</label>
                                            <input type="text" value={slugOverride} onChange={(e) => setSlugOverride(e.target.value)} placeholder="anker-liberty-5-white" style={styles.input} />
                                            <p style={{ fontSize: '11px', color: '#999', marginTop: '5px' }}>Leave empty to auto-generate from name.</p>
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={styles.label}>SEO Meta Title</label>
                                            <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Google Search Title" style={styles.input} />
                                        </div>
                                        <div>
                                            <label style={styles.label}>SEO Meta Description</label>
                                            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Short summary for Google results" style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Hero Banner Accordion (Edit Mode Only Usually, but let's keep it here) */}
                            {isEditMode && (
                                <div>
                                    <div style={styles.collapsibleHeader} onClick={() => toggleSection('hero')}>
                                        <span style={{ fontWeight: '600' }}><i className="fas fa-bullhorn" style={{ color: '#E41E26', marginRight: '8px' }}></i> Hero Banner Text</span>
                                        <i className={`fas fa-chevron-${expandedSections.hero ? 'up' : 'down'}`}></i>
                                    </div>
                                    {expandedSections.hero && (
                                        <div style={styles.collapsibleBody}>
                                            <div style={styles.row}>
                                                <div>
                                                    <label style={styles.label}>Headline</label>
                                                    <input type="text" value={featureHeadline} onChange={(e) => setFeatureHeadline(e.target.value)} placeholder="e.g. Silence the World" style={styles.input} />
                                                </div>
                                                <div>
                                                    <label style={styles.label}>Subtext</label>
                                                    <input type="text" value={featureSubtext} onChange={(e) => setFeatureSubtext(e.target.value)} placeholder="e.g. Adaptive ANC 2.0" style={styles.input} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    )}
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

