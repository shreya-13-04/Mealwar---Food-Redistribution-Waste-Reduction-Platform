import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../../../context/ListingsContext';
import { useAuth } from '../../../context/AuthContext';

const BuyerHome = () => {
    const { listings } = useListings();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [nearbyListings, setNearbyListings] = useState([]);
    const [locationStatus, setLocationStatus] = useState('Detecting your location...');

    useEffect(() => {
        // Mock location detection
        setTimeout(() => {
            setLocationStatus('📍 Downtown, Delhi');
            // Filter some listings as "nearby" for now
            setNearbyListings(listings.slice(0, 3));
        }, 1500);
    }, [listings]);

    return (
        <div style={{ maxWidth: '1000px' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Explore Surplus Food Near You</h2>
                <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {locationStatus}
                </p>
            </div>

            <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Fresh Arrivals</h3>
                    <button
                        onClick={() => navigate('/buyer/dashboard/search')}
                        style={{ border: 'none', background: 'none', color: 'var(--secondary-color)', fontWeight: '600', cursor: 'pointer' }}
                    >
                        View All Listings →
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {nearbyListings.map(listing => (
                        <div
                            key={listing.id}
                            onClick={() => navigate(`/buyer/dashboard/listing/${listing.id}`)}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius)',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ height: '180px', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
                                <img src={listing.imageUrl} alt={listing.foodName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        color: listing.redistributionMode === 'donation' ? 'var(--secondary-color)' : 'var(--primary-color)'
                                    }}>
                                        {listing.redistributionMode === 'donation' ? 'Free' : `$${listing.price}`}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{listing.location}</span>
                                </div>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>{listing.foodName}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                    {listing.quantity} {listing.unit} • {listing.foodType.replace('_', ' ')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ fontSize: '3rem' }}>💡</div>
                <div>
                    <h3 style={{ marginTop: 0 }}>Help us reduce waste!</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Every meal you claim saves energy and water used in food production. Start your impact journey today.</p>
                </div>
                <button className="btn btn-secondary" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>Invite Friends</button>
            </section>
        </div>
    );
};

export default BuyerHome;
