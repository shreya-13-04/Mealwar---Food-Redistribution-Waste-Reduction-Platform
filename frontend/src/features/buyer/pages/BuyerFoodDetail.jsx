import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListings } from '../../../context/ListingsContext';

const BuyerFoodDetail = () => {
    const { id } = useParams();
    const { listings } = useListings();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);

    useEffect(() => {
        const item = listings.find(l => l.id === parseInt(id));
        if (item) setListing(item);
    }, [id, listings]);

    if (!listing) return <div>Loading food details...</div>;

    return (
        <div style={{ maxWidth: '900px', backgroundColor: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr' }}>
                <div style={{ height: '450px', backgroundColor: '#f5f5f5' }}>
                    <img src={listing.imageUrl} alt={listing.foodName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                backgroundColor: listing.redistributionMode === 'donation' ? '#e8f5e9' : '#fff3e0',
                                color: listing.redistributionMode === 'donation' ? 'var(--secondary-color)' : 'var(--primary-color)'
                            }}>
                                {listing.redistributionMode === 'donation' ? 'DONATION' : 'DISCOUNTED'}
                            </span>
                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary-color)' }}>
                                {listing.redistributionMode === 'donation' ? 'Free' : `$${listing.price}`}
                            </span>
                        </div>
                        <h2 style={{ margin: '0 0 0.5rem 0' }}>{listing.foodName}</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>📍 {listing.location}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <DetailItem label="Quantity" value={`${listing.quantity} ${listing.unit}`} />
                        <DetailItem label="Type" value={listing.foodType.replace('_', ' ')} />
                        <DetailItem label="Hygiene" value={listing.hygieneStatus} />
                        <DetailItem label="Prep Time" value={listing.preparationTime} />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>Description</h4>
                        <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)', margin: 0 }}>
                            {listing.description || "Freshly prepared food ready for pickup. Please bring your own containers if possible."}
                        </p>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => navigate(`/buyer/dashboard/checkout/${listing.id}`)}
                            className="btn btn-secondary"
                            style={{ flex: 2, padding: '1rem' }}
                        >
                            Claim this Food
                        </button>
                        <button
                            className="btn"
                            style={{ flex: 1, backgroundColor: '#f5f5f5', color: 'var(--text-main)' }}
                        >
                            ❤️ Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Seller Info Section */}
            <div style={{ padding: '2rem', borderTop: '1px solid #eee', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🏪</div>
                <div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>City Central Kitchen</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified Seller • 4.9⭐ (120 ratings)</p>
                </div>
                <button className="btn" style={{ marginLeft: 'auto', fontSize: '0.85rem', border: '1px solid #ddd' }}>View Profile</button>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div style={{ backgroundColor: '#f9f9f9', padding: '0.75rem', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{value}</p>
    </div>
);

export default BuyerFoodDetail;
