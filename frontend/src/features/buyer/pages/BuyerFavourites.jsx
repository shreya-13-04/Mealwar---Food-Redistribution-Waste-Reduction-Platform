import React, { useState } from 'react';

const BuyerFavourites = () => {
    const [favourites] = useState([
        {
            id: 1,
            name: 'Main Street Bakery',
            type: 'Bakery',
            rating: 4.8,
            totalRatings: 156,
            items: 'Pastries, Bread, Cakes',
            image: '🏪'
        },
        {
            id: 2,
            name: 'City Garden NGO',
            type: 'NGO / Community',
            rating: 4.9,
            totalRatings: 89,
            items: 'Organic Vegetables, Fruits',
            image: '🏡'
        }
    ]);

    return (
        <div style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '2rem' }}>Favourite Sellers</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {favourites.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: 'var(--radius)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>You haven't saved any favourites yet.</p>
                    </div>
                ) : (
                    favourites.map(seller => (
                        <div
                            key={seller.id}
                            style={{
                                backgroundColor: 'white',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius)',
                                boxShadow: 'var(--shadow)',
                                display: 'flex',
                                gap: '1.25rem',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ width: '70px', height: '70px', borderRadius: '12px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                                {seller.image}
                            </div>

                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 0.25rem 0' }}>{seller.name}</h4>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{seller.type}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fbc02d' }}>★ {seller.rating}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#999' }}>({seller.totalRatings} ratings)</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)' }}><strong>Specialties:</strong> {seller.items}</p>
                            </div>

                            <button style={{ background: 'none', border: 'none', color: '#ff5252', fontSize: '1.2rem', cursor: 'pointer' }}>❤️</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BuyerFavourites;
