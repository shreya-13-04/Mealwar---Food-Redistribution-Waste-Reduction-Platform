import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const SellerDashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="seller-dashboard" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
            {/* Hamburger Menu Button */}
            <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Mobile Overlay */}
            <div className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

            {/* Sidebar */}
            <aside className={mobileMenuOpen ? 'mobile-open' : ''} style={{ width: '260px', backgroundColor: 'var(--white)', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem' }}>
                <div style={{ marginBottom: '2.5rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>MealWar</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Seller Panel</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <DashboardLink to="/seller/dashboard" end>Dashboard</DashboardLink>

                    <DashboardLink to="/seller/dashboard/listings">Manage Listings</DashboardLink>
                    <DashboardLink to="/seller/dashboard/orders">Orders</DashboardLink>
                    <DashboardLink to="/seller/dashboard/payments">Payments</DashboardLink>
                    <DashboardLink to="/seller/dashboard/ratings">Ratings</DashboardLink>
                    <DashboardLink to="/seller/dashboard/notifications">Notifications</DashboardLink>
                    <DashboardLink to="/seller/dashboard/profile">My Profile</DashboardLink>
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        marginTop: 'auto',
                        padding: '0.75rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#d9534f',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header style={{ height: '70px', backgroundColor: 'var(--white)', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
                    <h3 style={{ margin: 0 }}>Welcome, {user?.displayName || 'Seller'}</h3>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <span
                            onClick={() => navigate('/')}
                            style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                            title="Go to Landing Page"
                        >
                            🏠
                        </span>
                        <span
                            style={{ cursor: 'pointer', position: 'relative' }}
                            onClick={() => navigate('/seller/dashboard/notifications')}
                        >
                            🔔
                            <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '10px' }}>2</span>
                        </span>
                        <div style={{ position: 'relative' }}>
                            <div
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                👤
                            </div>
                            {showProfileMenu && (
                                <div style={{ position: 'absolute', right: 0, top: '45px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '8px', minWidth: '150px', zIndex: 1000 }}>
                                    <div
                                        onClick={() => { navigate('/seller/dashboard/profile'); setShowProfileMenu(false); }}
                                        style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                    >
                                        👤 My Profile
                                    </div>
                                    <div
                                        onClick={() => { handleLogout(); setShowProfileMenu(false); }}
                                        style={{ padding: '0.75rem 1rem', cursor: 'pointer', color: '#d9534f' }}
                                    >
                                        🚪 Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const DashboardLink = ({ to, children, end }) => (
    <NavLink
        to={to}
        end={end}
        style={({ isActive }) => ({
            textDecoration: 'none',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            color: isActive ? 'var(--white)' : 'var(--text-main)',
            backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
            fontWeight: isActive ? '600' : '500',
            transition: 'all 0.2s'
        })}
    >
        {children}
    </NavLink>
);

export default SellerDashboardLayout;
