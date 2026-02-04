import React, { useState } from 'react';

const VolunteerHome = () => {
    const [isActive, setIsActive] = useState(true);

    const stats = {
        totalDeliveries: 47,
        completedToday: 3,
        rating: 4.8,
        pendingRequests: 2
    };

    return (
        <div style={{ maxWidth: '1000px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Dashboard Overview</h2>

                {/* Availability Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'white', padding: '1rem 1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Availability:</span>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '20px',
                            border: 'none',
                            backgroundColor: isActive ? 'var(--secondary-color)' : '#ccc',
                            color: 'white',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        {isActive ? '🟢 Active' : '🔴 Inactive'}
                    </button>
                    {!isActive && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>No new orders will be assigned</p>}
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard icon="📦" title="Total Deliveries" value={stats.totalDeliveries} color="#1976d2" />
                <StatCard icon="✅" title="Completed Today" value={stats.completedToday} color="#2e7d32" />
                <StatCard icon="⭐" title="Your Rating" value={stats.rating.toFixed(1)} color="#fbc02d" />
                <StatCard icon="🔔" title="Pending Requests" value={stats.pendingRequests} color="#ff5252" />
            </div>

            {/* Active Alert */}
            {isActive && stats.pendingRequests > 0 && (
                <div style={{ backgroundColor: '#fff8e1', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', border: '1px solid #ffc107' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>🚨 New Delivery Requests Available!</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>You have <strong>{stats.pendingRequests} new delivery requests</strong> waiting. Check them out in the Orders section!</p>
                </div>
            )}

            {/* Quick Actions */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <ActionButton icon="📦" label="View Orders" />
                    <ActionButton icon="✅" label="Complete Verification" />
                    <ActionButton icon="⭐" label="Check Ratings" />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', borderLeft: `4px solid ${color}` }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{title}</p>
        <h3 style={{ margin: 0, fontSize: '1.8rem', color }}>{value}</h3>
    </div>
);

const ActionButton = ({ icon, label }) => (
    <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', padding: '1rem', backgroundColor: '#f5f5f5', color: 'var(--text-main)' }}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <span>{label}</span>
    </button>
);

export default VolunteerHome;
