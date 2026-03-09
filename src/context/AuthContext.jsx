import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const localUser = localStorage.getItem('userInfo');
        return localUser ? JSON.parse(localUser) : null;
    });

    const login = async (email, password) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    };

    const register = async (name, email, password) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const updateProfile = async (updates) => {
        if (!user || !user.token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (response.ok) {
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } else {
            throw new Error(data.message || 'Failed to update profile');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
