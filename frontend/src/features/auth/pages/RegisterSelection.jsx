import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterSelection = () => {
    const navigate = useNavigate();

    const handleSelect = (role) => {
        navigate(`/register/${role}`);
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className="selection-container">
                <h1>Join MealWar</h1>
                <p>Choose your role to get started and help us reduce food waste.</p>

                <div className="selection-grid">
                    <div className="selection-card" onClick={() => handleSelect('seller')}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏪</div>
                        <h3>Seller</h3>
                        <p>Restaurants, Hotels, Events</p>
                        <p className="muted">List surplus food and manage donations or discounted sales.</p>
                    </div>

                    <div className="selection-card" onClick={() => handleSelect('buyer')}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🥗</div>
                        <h3>Buyer / NGO</h3>
                        <p>Individuals or Organizations</p>
                        <p className="muted">Browse available food in your area and receive fresh meals.</p>
                    </div>

                    <div className="selection-card" onClick={() => handleSelect('volunteer')}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚲</div>
                        <h3>Volunteer</h3>
                        <p>Delivery Partners</p>
                        <p className="muted">Help pick up and deliver food. Earn rewards and make an impact.</p>
                    </div>
                </div>

                <div style={{ marginTop: '3rem' }}>
                    <p>Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Login</Link></p>
                </div>
            </div>
        </div>
    );
};

// Internal Link helper for the component
const Link = ({ to, children, style }) => {
    const navigate = useNavigate();
    return (
        <a
            href={to}
            onClick={(e) => { e.preventDefault(); navigate(to); }}
            style={{ textDecoration: 'none', cursor: 'pointer', ...style }}
        >
            {children}
        </a>
    );
};

export default RegisterSelection;
