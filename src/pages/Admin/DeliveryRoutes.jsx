import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/apiClient';
import { useSiteConfig } from '../../context/SiteConfigContext';

const defaultDeliveryRouteGroups = [
    {
        road: 'WAIYAKI WAY',
        items: [
            { location: 'Museum Hill', price: 300 },
            { location: 'Chiromo', price: 300 },
            { location: "Westland's", price: 300 },
            { location: 'Sarit Center', price: 300 },
            { location: 'Safaricom', price: 350 },
            { location: 'Kangemi', price: 450 },
            { location: 'Uthiru', price: 500 },
            { location: 'Kinoo', price: 600 },
            { location: 'Regen', price: 700 },
            { location: 'Kikuyu', price: 1000 },
            { location: 'Past Kikuyu', price: 1500 },
        ],
    },
    {
        road: 'LANGATA ROAD',
        items: [
            { location: 'Nairobi West', price: 300 },
            { location: 'Madaraka', price: 300 },
            { location: 'T-Mall', price: 300 },
            { location: 'Canivore', price: 400 },
            { location: 'Langata Area', price: 400 },
            { location: 'Galleria', price: 500 },
            { location: 'Waterfront', price: 600 },
            { location: 'Karen', price: 700 },
            { location: "Ngong'", price: 1000 },
            { location: 'Kiserian', price: 2000 },
        ],
    },
    {
        road: 'LIMURU ROAD',
        items: [
            { location: 'Fig tree', price: 250 },
            { location: 'Parklands', price: 300 },
            { location: 'Agakhan', price: 300 },
            { location: 'Muthaiga', price: 300 },
            { location: 'Un', price: 500 },
            { location: 'Gachie', price: 600 },
            { location: 'Kitusuru', price: 600 },
            { location: 'Village market', price: 500 },
            { location: 'Two River', price: 600 },
            { location: 'Ruaka', price: 700 },
            { location: 'Wangive', price: 800 },
        ],
    },
    {
        road: 'JOGOO ROAD',
        items: [
            { location: 'City Stadium', price: 300 },
            { location: 'Shauri Moyo', price: 350 },
            { location: 'Huruma', price: 350 },
            { location: 'Kariobangi', price: 450 },
            { location: 'Buruburu', price: 450 },
            { location: 'Donholm', price: 500 },
            { location: 'Umoja', price: 500 },
            { location: 'Embakasi', price: 600 },
            { location: 'Fedha', price: 600 },
            { location: 'Kayole', price: 800 },
            { location: 'Choka', price: 1000 },
        ],
    },
    {
        road: 'CBD',
        items: [
            { location: 'Parliament Rd', price: 200 },
            { location: 'Koinange Str', price: 150 },
            { location: 'Kimathi Str', price: 150 },
            { location: 'Moi Avenue', price: 150 },
            { location: 'Tom Mboya', price: 150 },
            { location: 'Kirinyaga Rd', price: 200 },
            { location: 'Kijabe str', price: 200 },
            { location: 'Kamkunji', price: 200 },
            { location: 'Gikomba', price: 300 },
        ],
    },
    {
        road: 'KIAMBU ROAD',
        items: [
            { location: 'DCI HQ', price: 300 },
            { location: 'Sharks Place', price: 300 },
            { location: 'Karura Forest', price: 400 },
            { location: 'Fourways', price: 450 },
            { location: 'Runda', price: 500 },
            { location: 'Kirigiti', price: 700 },
            { location: 'Kiambu', price: 800 },
            { location: 'Tatu City from', price: 1500 },
        ],
    },
    {
        road: 'MOMBASA ROAD',
        items: [
            { location: 'Nyayo Stadium', price: 300 },
            { location: 'South B & C', price: 350 },
            { location: 'Nairobi West', price: 350 },
            { location: 'Airtel', price: 500 },
            { location: 'Imara Daima', price: 500 },
            { location: 'Cabanas', price: 500 },
            { location: 'Utawala from', price: 800 },
            { location: 'Syokimau from', price: 800 },
            { location: 'Katani Rd from', price: 800 },
            { location: 'Mlolongo from', price: 900 },
            { location: 'Athi River from', price: 1000 },
            { location: 'Kitengera from', price: 1500 },
        ],
    },
    {
        road: "NGONG' RD",
        items: [
            { location: 'Upper Hill', price: 300 },
            { location: 'Haringam', price: 300 },
            { location: 'Kilimani', price: 350 },
            { location: 'Yaya Center', price: 350 },
            { location: 'Lavington', price: 450 },
            { location: 'Kileleshwa', price: 350 },
            { location: 'Junction Mall', price: 500 },
            { location: 'Naivasha Rd', price: 600 },
            { location: 'Dagoreti', price: 1000 },
        ],
    },
    {
        road: 'THIKA ROAD',
        items: [
            { location: 'Ngara', price: 250 },
            { location: 'Pangani', price: 300 },
            { location: 'Muthaiga', price: 300 },
            { location: 'Survey', price: 400 },
            { location: 'Allsops', price: 400 },
            { location: 'Thome', price: 500 },
            { location: 'Garden city', price: 500 },
            { location: 'Roysambu from', price: 500 },
            { location: 'Githurai 44/45 from', price: 600 },
            { location: 'Kahawa from', price: 600 },
            { location: 'Bypass from', price: 700 },
            { location: 'Ruiru from', price: 800 },
            { location: 'Juja from', price: 1000 },
            { location: 'Thika from', price: 1500 },
        ],
    },
];

const emptyItem = () => ({ location: '', price: '' });

const DeliveryRoutes = () => {
    const { config, setConfig } = useSiteConfig();
    const [routeGroups, setRouteGroups] = useState(defaultDeliveryRouteGroups);
    const [collapsedGroups, setCollapsedGroups] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!config) return;
        if (Array.isArray(config.deliveryRouteGroups) && config.deliveryRouteGroups.length > 0) {
            setRouteGroups(config.deliveryRouteGroups);
        }
    }, [config]);

    const updateGroupName = (groupIndex, value) => {
        setRouteGroups((prev) =>
            prev.map((group, index) => (index === groupIndex ? { ...group, road: value } : group))
        );
    };

    const updateItem = (groupIndex, itemIndex, key, value) => {
        setRouteGroups((prev) =>
            prev.map((group, index) => {
                if (index !== groupIndex) return group;
                const nextItems = [...(group.items || [])];
                nextItems[itemIndex] = { ...nextItems[itemIndex], [key]: value };
                return { ...group, items: nextItems };
            })
        );
    };

    const addGroup = () => {
        setRouteGroups((prev) => [...prev, { road: '', items: [emptyItem()] }]);
    };

    const removeGroup = (groupIndex) => {
        setRouteGroups((prev) => prev.filter((_, index) => index !== groupIndex));
    };

    const addItem = (groupIndex) => {
        setRouteGroups((prev) =>
            prev.map((group, index) =>
                index === groupIndex
                    ? { ...group, items: [...(group.items || []), emptyItem()] }
                    : group
            )
        );
    };

    const removeItem = (groupIndex, itemIndex) => {
        setRouteGroups((prev) =>
            prev.map((group, index) => {
                if (index !== groupIndex) return group;
                return { ...group, items: (group.items || []).filter((_, i) => i !== itemIndex) };
            })
        );
    };

    const toggleGroup = (groupIndex) => {
        setCollapsedGroups((prev) => ({
            ...prev,
            [groupIndex]: !prev[groupIndex],
        }));
    };

    const expandAll = () => {
        setCollapsedGroups({});
    };

    const collapseAll = () => {
        const next = {};
        routeGroups.forEach((_, index) => {
            next[index] = true;
        });
        setCollapsedGroups(next);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setSaving(true);
        try {
            const cleaned = routeGroups
                .map((group) => ({
                    road: String(group.road || '').trim(),
                    items: (group.items || [])
                        .map((item) => ({
                            location: String(item.location || '').trim(),
                            price: Number(item.price),
                        }))
                        .filter((item) => item.location && Number.isFinite(item.price) && item.price >= 0),
                }))
                .filter((group) => group.road && group.items.length > 0);

            if (cleaned.length === 0) {
                throw new Error('Add at least one route group with one location and price.');
            }

            const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/site-config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deliveryRouteGroups: cleaned }),
            });

            setConfig(data);
            setRouteGroups(cleaned);
            setMessage('Delivery routes saved successfully.');
        } catch (err) {
            setError(err.message || 'Failed to save delivery routes.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '10px', color: '#111827' }}>
                Delivery Routes & Prices
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
                Maintain delivery prices grouped by road/zone exactly like your courier price list.
            </p>

            {error && (
                <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>
                    {error}
                </div>
            )}
            {message && (
                <div style={{ backgroundColor: '#ecfdf3', color: '#166534', padding: '10px 12px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>
                    {message}
                </div>
            )}

            <form onSubmit={submitHandler}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={expandAll}
                        style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            background: '#fff',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Expand all
                    </button>
                    <button
                        type="button"
                        onClick={collapseAll}
                        style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            background: '#fff',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Collapse all
                    </button>
                    <button
                        type="button"
                        onClick={addGroup}
                        style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px dashed #d1d5db',
                            background: '#fff',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        + Add road group
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#E41E26',
                            color: '#fff',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontWeight: 700,
                        }}
                    >
                        {saving ? 'Saving...' : 'Save delivery routes'}
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                    {routeGroups.map((group, groupIndex) => (
                        <section
                            key={`${group.road}-${groupIndex}`}
                            style={{
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '16px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <input
                                    type="text"
                                    value={group.road || ''}
                                    onChange={(e) => updateGroupName(groupIndex, e.target.value)}
                                    placeholder="Road heading (e.g. WAIYAKI WAY)"
                                    style={{
                                        width: '100%',
                                        maxWidth: '420px',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        fontWeight: 700,
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(groupIndex)}
                                    style={{
                                        marginLeft: '12px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: '#374151',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                    }}
                                >
                                    {collapsedGroups[groupIndex] ? 'Expand' : 'Collapse'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeGroup(groupIndex)}
                                    style={{
                                        marginLeft: '12px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: '#dc2626',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Remove group
                                </button>
                            </div>

                            {!collapsedGroups[groupIndex] && (
                            <>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {(group.items || []).map((item, itemIndex) => (
                                    <div key={`${item.location}-${itemIndex}`} style={{ display: 'grid', gridTemplateColumns: '1fr 140px auto', gap: '8px' }}>
                                        <input
                                            type="text"
                                            value={item.location || ''}
                                            onChange={(e) => updateItem(groupIndex, itemIndex, 'location', e.target.value)}
                                            placeholder="Location / Stop"
                                            style={{
                                                padding: '9px 10px',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                            }}
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.price}
                                            onChange={(e) => updateItem(groupIndex, itemIndex, 'price', e.target.value)}
                                            placeholder="Price"
                                            style={{
                                                padding: '9px 10px',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeItem(groupIndex, itemIndex)}
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#dc2626',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => addItem(groupIndex)}
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px dashed #d1d5db',
                                    background: '#f9fafb',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                }}
                            >
                                + Add location
                            </button>
                            </>
                            )}
                        </section>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default DeliveryRoutes;
