import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BuyerOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock order data
    const order = {
        id: id || 'ORD-5521',
        date: 'Feb 4, 10:30 AM',
        status: 'In Transit',
        seller: {
            name: 'Main Street Bakery',
            address: '123 Bakers Street, Downtown',
            phone: '+1 234 567 890'
        },
        items: [
            { name: 'Assorted Morning Pastries', qty: 2, price: 6.00 },
            { name: 'Chocolate Croissants', qty: 2, price: 6.00 }
        ],
        deliveryType: 'Volunteer Delivery',
        deliveryAddress: '456 My Home Ave, Apt 4B',
        total: 12.00
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>←</button>
                <h2 style={{ margin: 0 }}>Order Details</h2>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', backgroundColor: '#fafafa' }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID</p>
                        <h4 style={{ margin: 0 }}>{order.id}</h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status</p>
                        <span style={{ color: 'var(--secondary-color)', fontWeight: '700' }}>{order.status}</span>
                    </div>
                </div>

                <div style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Items</h4>
                        {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span>{item.qty}x {item.name}</span>
                                <span>${item.price.toFixed(2)}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: '2px solid #eee', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.1rem' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--secondary-color)' }}>${order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seller</h4>
                            <p style={{ margin: 0, fontWeight: '600' }}>{order.seller.name}</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>{order.seller.address}</p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Delivery To</h4>
                            <p style={{ margin: 0, fontWeight: '600' }}>{order.deliveryAddress}</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>Method: {order.deliveryType}</p>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => navigate(`/buyer/dashboard/track/${order.id}`)}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                    >
                        Track Shipment
                    </button>
                    <button className="btn" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #ddd' }}>Download Invoice</button>
                </div>
            </div>
        </div>
    );
};

export default BuyerOrderDetails;
