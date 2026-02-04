import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const VolunteerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1>Volunteer Hub</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Thank you for your service, {user?.displayName || 'Volunteer'}.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary">Find Nearby Pickups</button>
                    <button onClick={() => { logout(); navigate('/login'); }} className="btn" style={{ backgroundColor: '#eee', color: 'black' }}>Logout</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', borderLeft: '5px solid var(--primary-color)' }}>
                    <h3>Impact Points</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0' }}>450 XP</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Top 10% in your area!</p>
                </div>

                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <h3>Deliveries Completed</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0' }}>12</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Last delivery: 2 days ago</p>
                </div>
            </div>

            <section style={{ marginTop: '3rem', backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <h3>Active Tasks</h3>
                <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No active delivery tasks assigned to you right now.</p>
            </section>
        </div>
    );
};

export default VolunteerDashboard;
