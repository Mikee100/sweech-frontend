import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                if (response.ok) {
                    fetchProducts();
                } else {
                    const data = await response.json();
                    alert(data.message || 'Delete failed');
                }
            } catch (err) {
                alert('Something went wrong');
            }
        }
    };

    const styles = {
        container: {
            padding: '20px 0'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
        },
        title: {
            fontSize: '28px',
            fontWeight: '800',
            color: '#1a1a1a',
            margin: 0
        },
        createBtn: {
            backgroundColor: '#E41E26',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 15px rgba(228, 30, 38, 0.2)',
            transition: 'all 0.3s'
        },
        tableContainer: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid #eee',
            overflow: 'hidden'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left'
        },
        th: {
            padding: '18px 24px',
            backgroundColor: '#f9f9f9',
            borderBottom: '1px solid #eee',
            color: '#666',
            fontSize: '13px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        td: {
            padding: '18px 24px',
            borderBottom: '1px solid #eee',
            fontSize: '14px',
            color: '#333'
        },
        productCell: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        },
        productImg: {
            width: '45px',
            height: '45px',
            borderRadius: '8px',
            objectFit: 'cover',
            backgroundColor: '#f5f5f5'
        },
        badge: {
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase'
        },
        actionBtn: {
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #eee',
            backgroundColor: 'white',
            cursor: 'pointer',
            marginRight: '8px',
            color: '#666',
            transition: 'all 0.2s',
            fontSize: '14px'
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: '#666' }}>Loading Products...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Products List</h1>
                    <p style={{ color: '#666', marginTop: '5px' }}>Manage all your physical and digital inventory in one place.</p>
                </div>
                <Link to="/admin/product/create" style={styles.createBtn}>
                    <i className="fas fa-plus"></i> Add New Product
                </Link>
            </div>

            {error && <div style={{ color: '#dc2626', marginBottom: '20px' }}>{error}</div>}

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Product</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Price</th>
                            <th style={styles.th}>Stock</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} style={{ transition: 'background 0.2s' }}>
                                <td style={styles.td}>
                                    <div style={styles.productCell}>
                                        <img src={product.images[0]} alt="" style={styles.productImg} />
                                        <div>
                                            <div style={{ fontWeight: '700', color: '#1a1a1a' }}>{product.name}</div>
                                            <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>ID: {product._id.slice(-8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <span style={{ color: '#666' }}>{product.category}</span>
                                    <div style={{ fontSize: '11px', color: '#999' }}>{product.subCategory}</div>
                                </td>
                                <td style={styles.td}>
                                    {product.onSale ? (
                                        <span style={{ ...styles.badge, backgroundColor: '#fff7ed', color: '#ea580c' }}>On Sale</span>
                                    ) : (
                                        <span style={{ ...styles.badge, backgroundColor: '#f0fdf4', color: '#16a34a' }}>Standard</span>
                                    )}
                                </td>
                                <td style={styles.td}>
                                    <span style={{ fontWeight: '700' }}>KSh {product.price.toLocaleString()}</span>
                                </td>
                                <td style={styles.td}>
                                    <div style={{
                                        color: product.stock > 10 ? '#333' : '#dc2626',
                                        fontWeight: product.stock <= 5 ? '700' : '400'
                                    }}>
                                        {product.stock} pcs
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <Link to={`/admin/product/${product._id}/edit`} style={{ ...styles.actionBtn, textDecoration: 'none' }}>
                                        <i className="fas fa-edit" style={{ color: '#3b82f6' }}></i>
                                    </Link>
                                    <button
                                        onClick={() => deleteHandler(product._id)}
                                        style={{ ...styles.actionBtn, color: '#dc2626' }}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
