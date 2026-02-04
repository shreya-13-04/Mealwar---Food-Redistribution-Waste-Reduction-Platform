import React, { useState } from 'react';

const SellerNotifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'order',
            title: 'New Order Received!',
            message: 'You have a new order for "Assorted Morning Pastries" from City NGO.',
            time: '2 mins ago',
            read: false
        },
        {
            id: 2,
            type: 'rating',
            title: 'New 5-Star Rating',
            message: 'A buyer left a glowing review for your "Garden Fresh Tomatoes".',
            time: '1 hour ago',
            read: false
        },
        {
            id: 3,
            type: 'system',
            title: 'Security Alert',
            message: 'Your password was successfully changed.',
            time: '3 hours ago',
            read: true
        },
        {
            id: 4,
            type: 'order',
            title: 'Order Completed',
            message: 'Order #1234 has been picked up and marked as completed.',
            time: 'Yesterday',
            read: true
        }
    ]);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Notifications</h2>
                <button
                    onClick={markAllAsRead}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}
                >
                    Mark all as read
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No notifications yet.</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            style={{
                                display: 'flex',
                                gap: '1.5rem',
                                backgroundColor: 'white',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius)',
                                boxShadow: 'var(--shadow)',
                                borderLeft: notification.read ? 'none' : '4px solid var(--primary-color)',
                                opacity: notification.read ? 0.8 : 1,
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: notification.type === 'order' ? '#e3f2fd' : notification.type === 'rating' ? '#fff8e1' : '#f5f5f5',
                                fontSize: '1.2rem'
                            }}>
                                {notification.type === 'order' ? '📦' : notification.type === 'rating' ? '⭐' : '🔔'}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <h4 style={{ margin: 0 }}>{notification.title}</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{notification.time}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>{notification.message}</p>
                            </div>

                            <button
                                onClick={() => deleteNotification(notification.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ccc',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    padding: '0 0.5rem'
                                }}
                                title="Delete"
                            >
                                &times;
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SellerNotifications;
