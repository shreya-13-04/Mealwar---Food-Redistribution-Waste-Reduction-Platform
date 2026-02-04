import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BuyerOrderRate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sellerRating, setSellerRating] = useState(0);
    const [volunteerRating, setVolunteerRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your feedback! Your contribution helps the community.');
        navigate('/buyer/dashboard/orders');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Rate your Experience</h2>

            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <h4 style={{ marginBottom: '1rem' }}>How was the Food?</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Rate the quality and freshness from <strong>Main Street Bakery</strong></p>
                    <StarRating rating={sellerRating} setRating={setSellerRating} />
                </div>

                <div style={{ marginBottom: '2.5rem', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>How was the Delivery?</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Rate the delivery service by <strong>Rajesh Kumar</strong></p>
                    <StarRating rating={volunteerRating} setRating={setVolunteerRating} />
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label>Additional Comments (Optional)</label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Tell us more about your experience..."
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                    />
                </div>

                <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '1rem' }}>
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

const StarRating = ({ rating, setRating }) => (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5].map(star => (
            <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= rating ? '#fbc02d' : '#eee',
                    transition: 'color 0.2s'
                }}
            >
                ★
            </span>
        ))}
    </div>
);

export default BuyerOrderRate;
