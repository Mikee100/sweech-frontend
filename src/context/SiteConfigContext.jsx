import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../utils/apiClient';

const SiteConfigContext = createContext(null);

export const SiteConfigProvider = ({ children }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/site-config`);
                setConfig(data);
            } catch (err) {
                console.error('Failed to load site config', err);
                if (err instanceof ApiError) {
                    setError(err.message || 'Failed to load site configuration');
                } else {
                    setError('Failed to load site configuration');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const value = {
        config,
        setConfig,
        loading,
        error,
    };

    return (
        <SiteConfigContext.Provider value={value}>
            {children}
        </SiteConfigContext.Provider>
    );
};

export const useSiteConfig = () => {
    return useContext(SiteConfigContext);
};

