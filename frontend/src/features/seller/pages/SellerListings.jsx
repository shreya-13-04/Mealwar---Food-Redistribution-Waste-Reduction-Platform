import React from 'react';
import { Link } from 'react-router-dom';

const SellerListings = () => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Manage Listings</h2>
                <Link to="/seller/dashboard/listings/create" className="btn btn-primary">+ Create New Listing</Link>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem' }}>Food Item</th>
                            <th style={{ padding: '1rem' }}>Quantity</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Expiry</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '1.5rem 1rem' }}>Vegetable Biryani</td>
                            <td style={{ padding: '1.5rem 1rem' }}>5 Packs</td>
                            <td style={{ padding: '1.5rem 1rem' }}><span style={{ backgroundColor: '#E1F5FE', color: '#0288D1', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>Active</span></td>
                            <td style={{ padding: '1.5rem 1rem' }}>2h 45m</td>
                            <td style={{ padding: '1.5rem 1rem' }}>
                                <button className="btn" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerListings;
