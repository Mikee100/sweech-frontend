import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/profile');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="container" style={{ padding: '60px 0', maxWidth: '900px' }}>
            <div style={{ marginBottom: '30px' }}>
                <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', marginBottom: '8px' }}>
                    Account
                </p>
                <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>My Profile</h1>
                <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '14px' }}>
                    Manage the basic information associated with your CaseProz account.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
                        Profile details
                    </h2>
                    <div style={{ display: 'grid', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '6px' }}>
                                Full name
                            </label>
                            <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '14px' }}>
                                {user.name}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '6px' }}>
                                Email address
                            </label>
                            <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: '14px' }}>
                                {user.email}
                            </div>
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>
                            Profile editing will be available soon. For now, contact support to change your account details.
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '24px', color: '#e5e7eb', boxShadow: '0 20px 40px rgba(15,23,42,0.45)' }}>
                    <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#f97316', marginBottom: '10px' }}>
                        Overview
                    </p>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                        Welcome back, {user.name.split(' ')[0]}.
                    </h3>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '18px' }}>
                        You&apos;re signed in with <span style={{ color: '#e5e7eb' }}>{user.email}</span>.
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', display: 'grid', gap: '8px' }}>
                        <li>• Track your orders from the <strong>My Orders</strong> page.</li>
                        <li>• Access the <strong>Admin Panel</strong> if you&apos;re an admin user.</li>
                        <li>• Secure logout anytime from the header dropdown.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;

