import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

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

    const sidebarWidth = isCollapsed ? '80px' : '260px';

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarWidth,
                backgroundColor: '#1a1a1a',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 1000,
                transition: 'width 0.3s ease'
            }}>
                <div style={{ 
                    padding: isCollapsed ? '30px 10px' : '30px 20px', 
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between'
                }}>
                    {!isCollapsed && (
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px', color: '#E41E26', margin: 0, whiteSpace: 'nowrap' }}>
                            CASEPROZ <span style={{ color: 'white', fontSize: '10px' }}>ADMIN</span>
                        </h2>
                    )}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '5px'
                        }}
                    >
                        <i className={`fas fa-${isCollapsed ? 'indent' : 'outdent'}`}></i>
                    </button>
                </div>

                <nav style={{ flex: 1, padding: '20px 0', overflowX: 'hidden' }}>
                    {[
                        { to: '/admin/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
                        { to: '/admin/productlist', icon: 'fas fa-box', label: 'Products' },
                        { to: '/admin/orderlist', icon: 'fas fa-shopping-cart', label: 'Orders' },
                        { to: '/admin/userlist', icon: 'fas fa-users', label: 'Users' },
                        { to: '/admin/discounts', icon: 'fas fa-tags', label: 'Discounts' },
                        { to: '/admin/categories-brands', icon: 'fas fa-layer-group', label: 'Categories & Brands' },
                        { to: '/admin/home-sections', icon: 'fas fa-th-large', label: 'Home Sections' },
                        { to: '/admin/settings', icon: 'fas fa-cog', label: 'Site Settings' },
                    ].map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                gap: '15px',
                                padding: '15px 25px',
                                color: isActive ? 'white' : '#999',
                                textDecoration: 'none',
                                backgroundColor: isActive ? '#E41E26' : 'transparent',
                                fontSize: '15px',
                                transition: 'all 0.3s',
                                whiteSpace: 'nowrap'
                            })}
                        >
                            <i className={link.icon} style={{ minWidth: '20px', textAlign: 'center' }}></i>
                            {!isCollapsed && <span>{link.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid #333' }}>
                    <button
                        onClick={handleLogout}
                        title={isCollapsed ? "Logout" : ""}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'transparent',
                            color: '#999',
                            border: '1px solid #333',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            gap: '10px'
                        }}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                    {!isCollapsed && (
                        <NavLink to="/" style={{ display: 'block', textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '13px', textDecoration: 'none' }}>
                            Back to Store
                        </NavLink>
                    )}
                    {isCollapsed && (
                         <NavLink to="/" title="Back to Store" style={{ display: 'block', textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '18px', textDecoration: 'none' }}>
                             <i className="fas fa-store"></i>
                         </NavLink>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ 
                flex: 1, 
                padding: '40px', 
                marginLeft: sidebarWidth,
                transition: 'margin-left 0.3s ease'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
