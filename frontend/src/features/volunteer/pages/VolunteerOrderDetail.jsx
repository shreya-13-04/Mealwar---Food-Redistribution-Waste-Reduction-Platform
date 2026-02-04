import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const VolunteerOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const sellerPos = [28.6139, 77.2090];
    const buyerPos = [28.6250, 77.2200];

    const order = {
        id: id || 'ORD-5521',
        seller: {
            name: 'Main Street Bakery',
            address: '123 Bakers Street, Downtown',
            phone: '+1 234 567 890',
            contact: 'John Baker'
        },
        buyer: {
            name: 'Sarah Johnson',
            address: '456 Oak Avenue, Apt 4B',
            phone: '+1 987 654 321'
        },
        items: 'Assorted Pastries (2 boxes)',
        payment: '$15',
        pickupBy: '11:00 AM',
        deliverBy: '12:00 PM',
        status: 'active'
    };

    return (
        <div style={{ height: 'calc(100vh - 120px)', display: 'flex', gap: '1.5rem' }}>
            {/* Left Panel - Order Info */}
            <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', textAlign: 'left' }}>
                    ← Back to Orders
                </button>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Order {order.id}</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Items</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontWeight: '600' }}>{order.items}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                        <span style={{ fontWeight: '600' }}>Earnings</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--secondary-color)' }}>{order.payment}</span>
                    </div>
                </div>

                {/* Pickup */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--secondary-color)' }}>📍 Pickup Location</h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>{order.seller.name}</p>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>{order.seller.address}</p>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Contact: {order.seller.contact}</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" style={{ flex: 1, fontSize: '0.85rem', backgroundColor: '#f5f5f5', color: 'var(--text-main)' }}>📞 Call</button>
                        <button className="btn" style={{ flex: 1, fontSize: '0.85rem', backgroundColor: '#f5f5f5', color: 'var(--text-main)' }}>💬 Text</button>
                    </div>
                    <p style={{ margin: '1rem 0 0 0', fontSize: '0.8rem' }}><strong>Pickup by:</strong> {order.pickupBy}</p>
                </div>

                {/* Delivery */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>🏠 Delivery Location</h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>{order.buyer.name}</p>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>{order.buyer.address}</p>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone: {order.buyer.phone}</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" style={{ flex: 1, fontSize: '0.85rem', backgroundColor: '#f5f5f5', color: 'var(--text-main)' }}>📞 Call</button>
                        <button className="btn" style={{ flex: 1, fontSize: '0.85rem', backgroundColor: '#f5f5f5', color: 'var(--text-main)' }}>💬 Text</button>
                    </div>
                    <p style={{ margin: '1rem 0 0 0', fontSize: '0.8rem' }}><strong>Deliver by:</strong> {order.deliverBy}</p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" style={{ width: '100%', padding: '1rem' }}>🗺️ Open in Google Maps</button>
                    <select
                        defaultValue=""
                        onChange={(e) => e.target.value && alert(`Status updated to: ${e.target.value}`)}
                        style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    >
                        <option value="" disabled>Update Delivery Status</option>
                        <option value="picked">✅ Picked up from seller</option>
                        <option value="transit">🚴 En route to buyer</option>
                        <option value="delivered">📦 Delivered successfully</option>
                    </select>
                </div>
            </div>

            {/* Right Panel - Map */}
            <div style={{ flex: 1, borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                <MapContainer center={sellerPos} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={sellerPos}>
                        <Popup>
                            <strong>{order.seller.name}</strong><br />
                            📍 Pickup Location
                        </Popup>
                    </Marker>
                    <Marker position={buyerPos}>
                        <Popup>
                            <strong>{order.buyer.name}</strong><br />
                            🏠 Delivery Location
                        </Popup>
                    </Marker>
                    <Polyline positions={[sellerPos, buyerPos]} color="var(--secondary-color)" weight={3} />
                </MapContainer>
            </div>
        </div>
    );
};

export default VolunteerOrderDetail;
