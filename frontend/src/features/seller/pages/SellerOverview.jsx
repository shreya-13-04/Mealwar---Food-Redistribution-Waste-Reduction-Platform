import React from 'react';
import { Link } from 'react-router-dom';

const SellerOverview = () => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Dashboard Overview</h2>
                <Link to="/seller/dashboard/listings/create" className="btn btn-primary">+ Create New Listing</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard title="Active Listings" value="3" icon="🍲" color="#E76F51" />
                <StatCard title="Pending Orders" value="1" icon="📦" color="#6A994E" />
                <StatCard title="Overall Rating" value="4.8 ★" icon="⭐" color="#F2CC8F" />
                <StatCard title="Total Earnings" value="₹2,450" icon="💰" color="#3A2E2A" />
            </div>

            <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <h3>Recent Activity</h3>
                <p style={{ color: 'var(--text-muted)' }}>No recent activity to show.</p>
            </section>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', borderTop: `4px solid ${color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>{title}</span>
            <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{value}</div>
    </div>
);

export default SellerOverview;
