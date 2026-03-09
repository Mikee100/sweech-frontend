import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const emptyDiscount = () => ({
    _id: null,
    code: '',
    description: '',
    type: 'percent',
    value: 10,
    minOrderTotal: 0,
    maxDiscount: '',
    active: true,
    startsAt: '',
    expiresAt: '',
    maxUses: '',
});

const Discounts = () => {
    const { user } = useAuth();
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [savingId, setSavingId] = useState(null);
    const [editing, setEditing] = useState(null);

    const fetchDiscounts = async () => {
        if (!user || !user.token) return;
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/discounts`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to load discount codes');
            }
            setDiscounts(data);
        } catch (err) {
            setError(err.message || 'Failed to load discount codes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const startNew = () => {
        setEditing(emptyDiscount());
    };

    const startEdit = (disc) => {
        setEditing({
            _id: disc._id,
            code: disc.code || '',
            description: disc.description || '',
            type: disc.type || 'percent',
            value: disc.value || 0,
            minOrderTotal: disc.minOrderTotal || 0,
            maxDiscount: disc.maxDiscount ?? '',
            active: disc.active !== false,
            startsAt: disc.startsAt ? disc.startsAt.substring(0, 10) : '',
            expiresAt: disc.expiresAt ? disc.expiresAt.substring(0, 10) : '',
            maxUses: disc.maxUses ?? '',
        });
    };

    const cancelEdit = () => setEditing(null);

    const handleChange = (field, value) => {
        setEditing((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const saveDiscount = async (e) => {
        e.preventDefault();
        if (!editing || !user || !user.token) return;

        const payload = {
            code: editing.code,
            description: editing.description,
            type: editing.type,
            value: Number(editing.value),
            minOrderTotal: Number(editing.minOrderTotal || 0),
            maxDiscount:
                editing.maxDiscount === '' ? undefined : Number(editing.maxDiscount),
            active: editing.active,
            startsAt: editing.startsAt ? new Date(editing.startsAt) : undefined,
            expiresAt: editing.expiresAt ? new Date(editing.expiresAt) : undefined,
            maxUses:
                editing.maxUses === '' ? undefined : Number(editing.maxUses),
        };

        const isNew = !editing._id;
        const url = isNew
            ? `${import.meta.env.VITE_API_URL}/api/discounts`
            : `${import.meta.env.VITE_API_URL}/api/discounts/${editing._id}`;
        const method = isNew ? 'POST' : 'PUT';

        setSavingId(editing._id || 'new');
        setError('');
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to save discount code');
            }
            setEditing(null);
            fetchDiscounts();
        } catch (err) {
            setError(err.message || 'Failed to save discount code');
        } finally {
            setSavingId(null);
        }
    };

    const deleteDiscount = async (disc) => {
        if (!window.confirm(`Delete discount code ${disc.code}?`)) return;
        if (!user || !user.token) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/discounts/${disc._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete discount code');
            }
            fetchDiscounts();
        } catch (err) {
            setError(err.message || 'Failed to delete discount code');
        }
    };

    const styles = {
        card: {
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid #eee',
            marginBottom: '24px',
        },
        label: {
            display: 'block',
            marginBottom: '6px',
            fontWeight: 600,
            color: '#374151',
            fontSize: '13px',
        },
        input: {
            width: '100%',
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '13px',
        },
    };

    return (
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '20px', color: '#111827' }}>
                Discount Codes
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
                Create and manage promotion codes that customers can apply at checkout.
            </p>

            {error && (
                <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            <div style={{ marginBottom: '16px' }}>
                <button
                    type="button"
                    onClick={startNew}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#E41E26',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    + New discount code
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#6b7280' }}>
                    Loading discount codes...
                </div>
            ) : (
                <div style={styles.card}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ textAlign: 'left', padding: '8px 6px', color: '#6b7280' }}>Code</th>
                                <th style={{ textAlign: 'left', padding: '8px 6px', color: '#6b7280' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: '8px 6px', color: '#6b7280' }}>Value</th>
                                <th style={{ textAlign: 'left', padding: '8px 6px', color: '#6b7280' }}>Min Total</th>
                                <th style={{ textAlign: 'left', padding: '8px 6px', color: '#6b7280' }}>Max Discount</th>
                                <th style={{ textAlign: 'left', padding: '8px 6px', color: '#6b7280' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '8px 6px', color: '#6b7280' }}>Usage</th>
                                <th style={{ textAlign: 'right', padding: '8px 6px', color: '#6b7280' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discounts.map((disc) => (
                                <tr key={disc._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '8px 6px', fontWeight: 600 }}>{disc.code}</td>
                                    <td style={{ padding: '8px 6px' }}>
                                        {disc.type === 'percent' ? 'Percent' : 'Amount'}
                                    </td>
                                    <td style={{ padding: '8px 6px' }}>
                                        {disc.type === 'percent'
                                            ? `${disc.value}%`
                                            : `KSh ${disc.value?.toLocaleString?.() ?? disc.value}`}
                                    </td>
                                    <td style={{ padding: '8px 6px' }}>
                                        {disc.minOrderTotal
                                            ? `KSh ${disc.minOrderTotal.toLocaleString()}`
                                            : 'None'}
                                    </td>
                                    <td style={{ padding: '8px 6px' }}>
                                        {typeof disc.maxDiscount === 'number'
                                            ? `KSh ${disc.maxDiscount.toLocaleString()}`
                                            : 'Unlimited'}
                                    </td>
                                    <td style={{ padding: '8px 6px' }}>
                                        <span
                                            style={{
                                                padding: '3px 8px',
                                                borderRadius: '999px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                backgroundColor: disc.active ? '#ecfdf5' : '#f3f4f6',
                                                color: disc.active ? '#16a34a' : '#4b5563',
                                            }}
                                        >
                                            {disc.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '8px 6px' }}>
                                        {disc.timesUsed ?? 0}
                                        {typeof disc.maxUses === 'number' && (
                                            <> / {disc.maxUses}</>
                                        )}
                                    </td>
                                    <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                                        <button
                                            type="button"
                                            onClick={() => startEdit(disc)}
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                border: '1px solid #e5e7eb',
                                                backgroundColor: '#f9fafb',
                                                fontSize: '12px',
                                                marginRight: '6px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteDiscount(disc)}
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                border: '1px solid #fee2e2',
                                                backgroundColor: '#fef2f2',
                                                color: '#b91c1c',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {discounts.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ padding: '16px 6px', color: '#6b7280' }}>
                                        No discount codes created yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {editing && (
                <div style={styles.card}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>
                        {editing._id ? `Edit ${editing.code}` : 'New Discount Code'}
                    </h2>
                    <form onSubmit={saveDiscount}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={styles.label}>Code</label>
                                <input
                                    type="text"
                                    value={editing.code}
                                    onChange={(e) => handleChange('code', e.target.value)}
                                    placeholder="e.g. CASE10"
                                    style={styles.input}
                                    required
                                />
                                <label style={{ ...styles.label, marginTop: '8px' }}>Description</label>
                                <input
                                    type="text"
                                    value={editing.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Short internal description"
                                    style={styles.input}
                                />
                            </div>
                            <div>
                                <label style={styles.label}>Type</label>
                                <select
                                    value={editing.type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                    style={styles.input}
                                >
                                    <option value="percent">Percent (%)</option>
                                    <option value="amount">Fixed amount (KSh)</option>
                                </select>
                                <label style={{ ...styles.label, marginTop: '8px' }}>
                                    Value {editing.type === 'percent' ? '(%)' : '(KSh)'}
                                </label>
                                <input
                                    type="number"
                                    value={editing.value}
                                    onChange={(e) => handleChange('value', e.target.value)}
                                    style={styles.input}
                                    required
                                />
                                <label style={{ ...styles.label, marginTop: '8px' }}>Min order total (KSh)</label>
                                <input
                                    type="number"
                                    value={editing.minOrderTotal}
                                    onChange={(e) => handleChange('minOrderTotal', e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                            <div>
                                <label style={styles.label}>Max discount (KSh, optional)</label>
                                <input
                                    type="number"
                                    value={editing.maxDiscount}
                                    onChange={(e) => handleChange('maxDiscount', e.target.value)}
                                    style={styles.input}
                                />
                                <label style={{ ...styles.label, marginTop: '8px' }}>Max uses (optional)</label>
                                <input
                                    type="number"
                                    value={editing.maxUses}
                                    onChange={(e) => handleChange('maxUses', e.target.value)}
                                    style={styles.input}
                                />
                                <label style={{ ...styles.label, marginTop: '8px' }}>Active</label>
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={editing.active}
                                        onChange={(e) => handleChange('active', e.target.checked)}
                                    />{' '}
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                        Allow customers to apply this code
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={styles.label}>Starts at (optional)</label>
                                <input
                                    type="date"
                                    value={editing.startsAt}
                                    onChange={(e) => handleChange('startsAt', e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                            <div>
                                <label style={styles.label}>Expires at (optional)</label>
                                <input
                                    type="date"
                                    value={editing.expiresAt}
                                    onChange={(e) => handleChange('expiresAt', e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={cancelEdit}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    border: '1px solid #e5e7eb',
                                    backgroundColor: '#fff',
                                    color: '#374151',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!!savingId}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: '#E41E26',
                                    color: 'white',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: savingId ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {savingId ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Discounts;

