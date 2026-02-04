import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const BuyerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1>Hello, {user?.displayName || 'Friend'}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome to your MealWar dashboard.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/listings" className="btn btn-primary">Find Food Now</Link>
                    <button onClick={() => { logout(); navigate('/login'); }} className="btn" style={{ backgroundColor: '#eee', color: 'black' }}>Logout</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <DashboardCard title="My Orders" description="View your current and past food reservations." icon="🛍️" />
                <DashboardCard title="Saved Listings" description="Restaurants you've bookmarked for later." icon="❤️" />
                <DashboardCard title="Profile Settings" description="Update your location and contact details." icon="⚙️" />
            </div>
        </div>
    );
};

const DashboardCard = ({ title, description, icon }) => (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', cursor: 'pointer', transition: 'transform 0.2s' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{icon}</div>
        <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>{description}</p>
    </div>
);

export default BuyerDashboard;
