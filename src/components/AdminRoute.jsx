import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, initializing } = useAuth();

    // Wait until auth state is resolved before deciding to redirect
    if (initializing) {
        return (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#6b7280' }}>
                <div className="loading-spinner large"></div>
            </div>
        );
    }

    return user && user.isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
