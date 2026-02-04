import React from 'react';

const SellerRatings = () => {
    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Ratings & Reviews</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary-color)' }}>4.8</div>
                    <div style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>★★★★★</div>
                    <p style={{ color: 'var(--text-muted)' }}>Based on 42 reviews</p>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <h4>Latest Reviews</h4>
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <strong>Rahul S.</strong>
                                <span style={{ color: 'var(--accent-color)' }}>★★★★★</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>"The food was fresh and well packed. Excellent initiative by the restaurant!"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerRatings;
