import React from 'react';

const BuyerNotifications = () => {
    const notifications = [
        { id: 1, type: 'order', title: 'Order Delivered', message: 'Your order #ORD-5490 has been delivered successfully!', time: '2 hours ago', read: false },
        { id: 2, type: 'info', title: 'New Listings Available', message: '5 new food listings are now available in your area.', time: '5 hours ago', read: true },
    ];

    return (
        <div style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '2rem' }}>Notifications</h2>
            {notifications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notifications.map(notif => (
                        <div
                            key={notif.id}
                            style={{
                                backgroundColor: notif.read ? 'white' : '#e3f2fd',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius)',
                                boxShadow: 'var(--shadow)',
                                borderLeft: `4px solid ${notif.type === 'order' ? 'var(--secondary-color)' : '#ccc'}`
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <h4 style={{ margin: 0 }}>{notif.title}</h4>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{notif.time}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{notif.message}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: 'var(--radius)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No notifications yet.</p>
                </div>
            )}
        </div>
    );
};

export default BuyerNotifications;
