import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerOrders = () => {
    const navigate = useNavigate();
    const [orders] = useState([
        {
            id: 'ORD-5521',
            item: 'Assorted Morning Pastries',
            seller: 'Main Street Bakery',
            status: 'in_transit',
            type: 'delivery',
            total: '$12.00',
            date: 'Feb 4, 10:30 AM',
            eta: '12:15 PM'
        },
        {
            id: 'ORD-5490',
            item: 'Garden Fresh Tomatoes',
            seller: 'City Garden NGO',
            status: 'completed',
            type: 'pickup',
            total: 'Free',
            date: 'Feb 3, 4:00 PM'
        }
    ]);

    return (
        <div style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '2rem' }}>My Orders</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map(order => (
                    <div
                        key={order.id}
                        style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius)',
                            boxShadow: 'var(--shadow)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID: {order.id}</span>
                                <h3 style={{ margin: '0.25rem 0 0 0' }}>{order.item}</h3>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    backgroundColor: order.status === 'in_transit' ? '#e3f2fd' : '#e8f5e9',
                                    color: order.status === 'in_transit' ? '#1976d2' : '#2e7d32'
                                }}>
                                    {order.status.replace('_', ' ').toUpperCase()}
                                </span>
                                <p style={{ margin: '0.5rem 0 0 0', fontWeight: '700', color: 'var(--secondary-color)' }}>{order.total}</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <OrderInfo label="Seller" value={order.seller} />
                            <OrderInfo label="Method" value={order.type === 'delivery' ? 'Volunteer Delivery' : 'Self Pickup'} />
                            <OrderInfo label="Date" value={order.date} />
                        </div>

                        {order.status === 'in_transit' && (
                            <div style={{ backgroundColor: '#fff8e1', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}><strong>🚴 Volunteer:</strong> Rajesh Kumar is on his way</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>ETA: {order.eta}</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/buyer/dashboard/track/${order.id}`)}
                                        className="btn btn-secondary"
                                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                                    >
                                        Track Order
                                    </button>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button
                                onClick={() => navigate(`/buyer/dashboard/order/${order.id}`)}
                                className="btn"
                                style={{ flex: 1, backgroundColor: '#f5f5f5', color: 'var(--text-main)', fontSize: '0.9rem' }}
                            >
                                Order Details
                            </button>
                            <button className="btn" style={{ flex: 1, backgroundColor: '#f5f5f5', color: 'var(--text-main)', fontSize: '0.9rem' }}>Need Help?</button>
                            {order.status === 'completed' && (
                                <button
                                    onClick={() => navigate(`/buyer/dashboard/rate/${order.id}`)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, fontSize: '0.9rem' }}
                                >
                                    Rate Order
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const OrderInfo = ({ label, value }) => (
    <div>
        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{value}</p>
    </div>
);

export default BuyerOrders;
