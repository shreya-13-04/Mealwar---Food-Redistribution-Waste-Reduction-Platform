import React from 'react';

const VolunteerRatings = () => {
    const ratingData = {
        overall: 4.8,
        totalDeliveries: 47,
        badges: [
            { name: 'Verified Volunteer', icon: '✅', earned: true },
            { name: 'Top Volunteer', icon: '⭐', earned: true },
            { name: '50 Deliveries', icon: '🏆', earned: false },
            { name: 'Perfect Week', icon: '💯', earned: false }
        ],
        recentReviews: [
            { from: 'Sarah Johnson', rating: 5, comment: 'Very professional and on time!', date: 'Feb 3' },
            { from: 'Mike Chen', rating: 5, comment: 'Great delivery service, food arrived fresh.', date: 'Feb 2' },
            { from: 'Emma Davis', rating: 4, comment: 'Good service, slightly delayed.', date: 'Feb 1' }
        ],
        stats: {
            onTime: 95,
            successful: 98,
            avgTime: 22 // minutes
        }
    };

    return (
        <div style={{ maxWidth: '900px' }}>
            <h2 style={{ marginBottom: '2rem' }}>Ratings & Badges</h2>

            {/* Overall Rating */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', color: '#fbc02d', marginBottom: '0.5rem' }}>⭐</div>
                <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '3rem', color: 'var(--secondary-color)' }}>{ratingData.overall}</h1>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>Based on {ratingData.totalDeliveries} deliveries</p>
            </div>

            {/* Badges */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>Your Badges</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    {ratingData.badges.map((badge, idx) => (
                        <div
                            key={idx}
                            style={{
                                textAlign: 'center',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                backgroundColor: badge.earned ? '#e8f5e9' : '#f5f5f5',
                                border: badge.earned ? '2px solid #2e7d32' : '2px dashed #ccc',
                                opacity: badge.earned ? 1 : 0.5
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{badge.icon}</div>
                            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.85rem' }}>{badge.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="On-Time Rate" value={`${ratingData.stats.onTime}%`} color="#2e7d32" />
                <StatCard title="Success Rate" value={`${ratingData.stats.successful}%`} color="#1976d2" />
                <StatCard title="Avg Delivery Time" value={`${ratingData.stats.avgTime} min`} color="#fbc02d" />
            </div>

            {/* Recent Reviews */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ marginTop: 0 }}>Recent Reviews</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {ratingData.recentReviews.map((review, idx) => (
                        <div key={idx} style={{ padding: '1rem', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '600' }}>{review.from}</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{review.date}</span>
                            </div>
                            <div style={{ color: '#fbc02d', marginBottom: '0.5rem' }}>
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{title}</p>
        <h3 style={{ margin: 0, fontSize: '2rem', color }}>{value}</h3>
    </div>
);

export default VolunteerRatings;
