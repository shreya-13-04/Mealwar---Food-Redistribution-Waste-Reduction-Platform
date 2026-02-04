import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VolunteerOrders = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('new');

    const orders = {
        new: [
            { id: 'ORD-5523', seller: 'Main Street Bakery', buyer: 'Sarah Johnson', pickupAddr: '123 Bakers St', deliveryAddr: '456 Oak Ave', distance: '2.3 km', payment: '$15', time: '5 mins ago' }
        ],
        active: [
            { id: 'ORD-5521', seller: 'City Garden NGO', buyer: 'Mike Chen', pickupAddr: '789 Garden Rd', deliveryAddr: '321 Pine St', distance: '1.8 km', payment: '$12', status: 'Picked up - En route to buyer' }
        ],
        completed: [
            { id: 'ORD-5490', seller: 'Downtown Cafe', buyer: 'Emma Davis', pickupAddr: '555 Main St', deliveryAddr: '888 Elm St', distance: '3.1 km', payment: '$18', completedAt: 'Feb 3, 4:30 PM' }
        ]
    };

    return (
        <div style={{ maxWidth: '1000px' }}>
            <h2 style={{ marginBottom: '2rem' }}>My Deliveries</h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid #eee' }}>
                <TabButton active={activeTab === 'new'} onClick={() => setActiveTab('new')} count={orders.new.length}>New Requests</TabButton>
                <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')} count={orders.active.length}>Active</TabButton>
                <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} count={orders.completed.length}>Completed</TabButton>
            </div>

            {/* Order List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {activeTab === 'new' && orders.new.map(order => <NewOrderCard key={order.id} order={order} navigate={navigate} />)}
                {activeTab === 'active' && orders.active.map(order => <ActiveOrderCard key={order.id} order={order} navigate={navigate} />)}
                {activeTab === 'completed' && orders.completed.map(order => <CompletedOrderCard key={order.id} order={order} navigate={navigate} />)}

                {orders[activeTab].length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: 'var(--radius)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No {activeTab} deliveries at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, count, children }) => (
    <button
        onClick={onClick}
        style={{
            padding: '1rem 0.5rem',
            border: 'none',
            background: 'none',
            fontSize: '1rem',
            fontWeight: active ? '700' : '500',
            color: active ? 'var(--secondary-color)' : 'var(--text-muted)',
            borderBottom: active ? '3px solid var(--secondary-color)' : 'none',
            cursor: 'pointer',
            position: 'relative'
        }}
    >
        {children} {count > 0 && <span style={{ marginLeft: '0.5rem', backgroundColor: active ? 'var(--secondary-color)' : '#ccc', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold' }}>{count}</span>}
    </button>
);

const NewOrderCard = ({ order, navigate }) => (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID: {order.id}</span>
                <h4 style={{ margin: '0.25rem 0 0 0' }}>📍 {order.seller} → {order.buyer}</h4>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: '700', color: 'var(--secondary-color)', fontSize: '1.1rem' }}>{order.payment}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.time}</span>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <div>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>Pickup</p>
                <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600' }}>{order.pickupAddr}</p>
            </div>
            <div>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>Delivery</p>
                <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600' }}>{order.deliveryAddr}</p>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <button
                onClick={() => navigate(`/volunteer/dashboard/order/${order.id}`)}
                className="btn"
                style={{ flex: 1, backgroundColor: '#f5f5f5', color: 'var(--text-main)' }}
            >
                View Details
            </button>
            <button className="btn btn-secondary" style={{ flex: 2 }}>Accept Delivery ({order.distance})</button>
        </div>
    </div>
);

const ActiveOrderCard = ({ order, navigate }) => (
    <div style={{ backgroundColor: '#e3f2fd', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '2px solid #1976d2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID: {order.id}</span>
                <h4 style={{ margin: '0.25rem 0 0 0' }}>🚴 {order.seller} → {order.buyer}</h4>
            </div>
            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#1976d2', color: 'white' }}>IN PROGRESS</span>
        </div>

        <p style={{ margin: '0 0 1rem 0', fontWeight: '600', color: '#1976d2' }}>{order.status}</p>

        <div style={{ display: 'flex', gap: '1rem' }}>
            <button
                onClick={() => navigate(`/volunteer/dashboard/order/${order.id}`)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
            >
                Navigate & Track
            </button>
            <button className="btn" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #1976d2', color: '#1976d2' }}>Update Status</button>
        </div>
    </div>
);

const CompletedOrderCard = ({ order, navigate }) => (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', opacity: 0.9 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID: {order.id}</span>
                <h4 style={{ margin: '0.25rem 0 0 0' }}>✅ {order.seller} → {order.buyer}</h4>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: '700', color: '#2e7d32' }}>{order.payment}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.completedAt}</span>
            </div>
        </div>

        <button
            onClick={() => navigate(`/volunteer/dashboard/order/${order.id}`)}
            className="btn"
            style={{ width: '100%', backgroundColor: '#f5f5f5', color: 'var(--text-main)' }}
        >
            View Details
        </button>
    </div>
);

export default VolunteerOrders;
