import React from 'react';

const SellerPayments = () => {
    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Payments & Earnings</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <h4>Earnings Summary</h4>
                    <div style={{ fontSize: '2rem', fontWeight: '800', margin: '1rem 0', color: 'var(--secondary-color)' }}>₹2,450.00</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Available for payout</p>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Request Payout</button>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <h4>Transaction History</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '0.8rem' }}>Date</th>
                                <th style={{ padding: '0.8rem' }}>Order ID</th>
                                <th style={{ padding: '0.8rem' }}>Amount</th>
                                <th style={{ padding: '0.8rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '1rem 0.8rem' }}>03 Feb</td>
                                <td style={{ padding: '1rem 0.8rem' }}>#MW-9821</td>
                                <td style={{ padding: '1rem 0.8rem' }}>₹450</td>
                                <td style={{ padding: '1rem 0.8rem' }}><span style={{ color: 'green' }}>Completed</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerPayments;
