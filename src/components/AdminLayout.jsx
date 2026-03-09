import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Remove the storefront header gap for admin routes
    useEffect(() => {
        const prevPaddingTop = document.body.style.paddingTop;
        const prevBg = document.body.style.backgroundColor;

        document.body.style.paddingTop = '0px';
        document.body.style.backgroundColor = '#f4f7f6';

        return () => {
            document.body.style.paddingTop = prevPaddingTop;
            document.body.style.backgroundColor = prevBg;
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#1a1a1a',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 1000
            }}>
                <div style={{ padding: '30px 20px', borderBottom: '1px solid #333' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', color: '#E41E26', margin: 0 }}>CASEPROZ <span style={{ color: 'white', fontSize: '12px' }}>ADMIN</span></h2>
                </div>

                <nav style={{ flex: 1, padding: '20px 0' }}>
                    <NavLink
                        to="/admin/dashboard"
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px 25px',
                            color: isActive ? 'white' : '#999',
                            textDecoration: 'none',
                            backgroundColor: isActive ? '#E41E26' : 'transparent',
                            fontSize: '15px',
                            transition: 'all 0.3s'
                        })}
                    >
                        <i className="fas fa-chart-line"></i> Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/productlist"
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px 25px',
                            color: isActive ? 'white' : '#999',
                            textDecoration: 'none',
                            backgroundColor: isActive ? '#E41E26' : 'transparent',
                            fontSize: '15px',
                            transition: 'all 0.3s'
                        })}
                    >
                        <i className="fas fa-box"></i> Products
                    </NavLink>
                    <NavLink
                        to="/admin/orderlist"
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px 25px',
                            color: isActive ? 'white' : '#999',
                            textDecoration: 'none',
                            backgroundColor: isActive ? '#E41E26' : 'transparent',
                            fontSize: '15px',
                            transition: 'all 0.3s'
                        })}
                    >
                        <i className="fas fa-shopping-cart"></i> Orders
                    </NavLink>
                    <NavLink
                        to="/admin/userlist"
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px 25px',
                            color: isActive ? 'white' : '#999',
                            textDecoration: 'none',
                            backgroundColor: isActive ? '#E41E26' : 'transparent',
                            fontSize: '15px',
                            transition: 'all 0.3s'
                        })}
                    >
                        <i className="fas fa-users"></i> Users
                    </NavLink>
                    <NavLink
                        to="/admin/discounts"
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px 25px',
                            color: isActive ? 'white' : '#999',
                            textDecoration: 'none',
                            backgroundColor: isActive ? '#E41E26' : 'transparent',
                            fontSize: '15px',
                            transition: 'all 0.3s'
                        })}
                    >
                        <i className="fas fa-tags"></i> Discounts
                    </NavLink>
                    <NavLink
                        to="/admin/settings"
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px 25px',
                            color: isActive ? 'white' : '#999',
                            textDecoration: 'none',
                            backgroundColor: isActive ? '#E41E26' : 'transparent',
                            fontSize: '15px',
                            transition: 'all 0.3s'
                        })}
                    >
                        <i className="fas fa-cog"></i> Site Settings
                    </NavLink>
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid #333' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'transparent',
                            color: '#999',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                    <NavLink to="/" style={{ display: 'block', textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '13px', textDecoration: 'none' }}>
                        Back to Store
                    </NavLink>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px', marginLeft: '260px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
