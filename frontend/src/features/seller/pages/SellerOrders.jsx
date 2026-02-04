import React from 'react';

const SellerOrders = () => {
    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Order Management</h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <TabButton active>Pending</TabButton>
                <TabButton>In Progress</TabButton>
                <TabButton>Completed</TabButton>
                <TabButton>Cancelled</TabButton>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>No orders found for this status.</p>
            </div>
        </div>
    );
};

const TabButton = ({ children, active }) => (
    <button style={{
        padding: '0.6rem 1.5rem',
        borderRadius: '25px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: active ? 'var(--primary-color)' : 'white',
        color: active ? 'white' : 'var(--text-main)',
        fontWeight: '600',
        boxShadow: active ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
    }}>
        {children}
    </button>
);

export default SellerOrders;
