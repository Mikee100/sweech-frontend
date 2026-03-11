import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../utils/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    // On app load, hydrate user from server using cookie-based auth
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/profile`);
                setUser(data);
            } catch (err) {
                // Not logged in or profile fetch failed; start with no user
                setUser(null);
            } finally {
                setInitializing(false);
            }
        };

        loadProfile();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            setUser(data);
            return data;
        } catch (err) {
            if (err instanceof ApiError) {
                throw new Error(err.message || 'Login failed');
            }
            throw new Error('Login failed. Please check your details and try again.');
        }
    };

    const register = async ({ name, email, password, phone, city, address, newsletterOptIn }) => {
        try {
            const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    phone,
                    city,
                    address,
                    newsletterOptIn,
                }),
            });

            setUser(data);
            return data;
        } catch (err) {
            if (err instanceof ApiError) {
                throw new Error(err.message || 'Registration failed');
            }
            throw new Error('Registration failed. Please check your details and try again.');
        }
    };

    const logout = async () => {
        try {
            await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/logout`, {
                method: 'POST',
            });
        } catch {
            // Ignore logout failures on client
        } finally {
            setUser(null);
        }
    };

    const updateProfile = async (updates) => {
        if (!user) {
            throw new Error('Not authenticated');
        }

        try {
            const data = await apiFetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            setUser(data);
            return data;
        } catch (err) {
            if (err instanceof ApiError) {
                throw new Error(err.message || 'Failed to update profile');
            }
            throw new Error('Failed to update profile. Please try again.');
        }
    };

    return (
        <AuthContext.Provider value={{ user, initializing, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
