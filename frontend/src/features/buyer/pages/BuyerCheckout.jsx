import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListings } from '../../../context/ListingsContext';

const BuyerCheckout = () => {
    const { id } = useParams();
    const { listings } = useListings();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [step, setStep] = useState(1);
    const [pickupType, setPickupType] = useState('self');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const item = listings.find(l => l.id === parseInt(id));
        if (item) setListing(item);
    }, [id, listings]);

    const handleConfirm = () => {
        setLoading(true);
        // Simulate order creation
        setTimeout(() => {
            setLoading(false);
            alert('🎉 Order Placed Successfully!');
            navigate('/buyer/dashboard/orders');
        }, 2000);
    };

    if (!listing) return <div>Loading checkout...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Checkout</h2>

            {/* Stepper */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', position: 'relative' }}>
                <StepCircle num={1} active={step >= 1} label="Method" />
                <div style={{ width: '100px', height: '2px', backgroundColor: step > 1 ? 'var(--secondary-color)' : '#eee', marginTop: '20px' }}></div>
                <StepCircle num={2} active={step >= 2} label="Confirm" />
            </div>

            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                {step === 1 ? (
                    <div>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Select Pickup Method</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <MethodCard
                                type="self"
                                active={pickupType === 'self'}
                                onClick={() => setPickupType('self')}
                                title="Self Pickup"
                                desc="Pick up the food yourself from the seller's location."
                                icon="🚶"
                            />
                            <MethodCard
                                type="volunteer"
                                active={pickupType === 'volunteer'}
                                onClick={() => setPickupType('volunteer')}
                                title="Volunteer Delivery"
                                desc="A nearby volunteer will deliver it to your address."
                                icon="🚴"
                                tag="Free"
                            />
                        </div>
                        <button
                            className="btn btn-secondary"
                            style={{ width: '100%', padding: '1rem' }}
                            onClick={() => setStep(2)}
                        >
                            Continue
                        </button>
                    </div>
                ) : (
                    <div>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Order Summary</h3>
                        <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>Item:</span>
                                <strong>{listing.foodName}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>Quantity:</span>
                                <strong>{listing.quantity} {listing.unit}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>Pickup Type:</span>
                                <strong>{pickupType === 'self' ? 'Self Pickup' : 'Volunteer Delivery'}</strong>
                            </div>
                            <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '1rem 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                                <span>Total:</span>
                                <strong style={{ color: 'var(--secondary-color)' }}>{listing.redistributionMode === 'donation' ? 'Free' : `$${listing.price}`}</strong>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn" style={{ flex: 1, backgroundColor: '#eee', color: 'black' }} onClick={() => setStep(1)}>Back</button>
                            <button className="btn btn-secondary" style={{ flex: 2 }} onClick={handleConfirm} disabled={loading}>
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StepCircle = ({ num, active, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: active ? 'var(--secondary-color)' : '#eee',
            color: active ? 'white' : '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            marginBottom: '0.5rem'
        }}>{num}</div>
        <span style={{ fontSize: '0.75rem', fontWeight: active ? '700' : '400' }}>{label}</span>
    </div>
);

const MethodCard = ({ type, active, onClick, title, desc, icon, tag }) => (
    <div
        onClick={onClick}
        style={{
            padding: '1.25rem',
            borderRadius: '12px',
            border: `2px solid ${active ? 'var(--secondary-color)' : '#eee'}`,
            backgroundColor: active ? '#f1f8e9' : 'white',
            cursor: 'pointer',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
        }}
    >
        <span style={{ fontSize: '2rem' }}>{icon}</span>
        <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 0.25rem 0' }}>{title}</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</p>
        </div>
        {tag && <span style={{ backgroundColor: 'var(--secondary-color)', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', alignSelf: 'flex-start' }}>{tag}</span>}
    </div>
);

export default BuyerCheckout;
