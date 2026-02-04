import React from 'react';

const VolunteerNotifications = () => {
    const notifications = [
        { id: 1, type: 'delivery', title: 'New Delivery Request', message: 'You have a new delivery request from Main Street Bakery.', time: '10 mins ago', read: false },
        { id: 2, type: 'rating', title: 'New Rating Received', message: 'Sarah Johnson rated you 5 stars for delivery #ORD-5521', time: '2 hours ago', read: false },
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
                                borderLeft: `4px solid ${notif.type === 'delivery' ? 'var(--secondary-color)' : '#fbc02d'}`
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

export default VolunteerNotifications;
