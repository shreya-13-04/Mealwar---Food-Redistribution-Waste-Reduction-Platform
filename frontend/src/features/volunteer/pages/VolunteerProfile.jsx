import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { updateProfileUser } from '../../auth/authApi';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../../services/firebase';

const VolunteerProfile = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        vehicleType: user?.vehicleType || 'bicycle'
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const updatedUser = await updateProfileUser({ ...formData, role: 'VOLUNTEER' });
            setUser(updatedUser);
            setMessage({ type: 'success', text: '✅ Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Failed to update profile: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setMessage({ type: 'error', text: '❌ Passwords do not match' });
        }
        setLoading(true);
        try {
            const firebaseUser = auth.currentUser;
            if (firebaseUser) {
                await updatePassword(firebaseUser, passwordData.newPassword);
                setMessage({ type: 'success', text: '✅ Password changed successfully!' });
                setPasswordData({ newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Failed to change password: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '2rem' }}>My Profile</h2>

            {message.text && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    backgroundColor: message.type === 'success' ? '#e8f5e9' : '#ffebee',
                    color: message.type === 'success' ? '#2e7d32' : '#c62828',
                    border: `1px solid ${message.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <form onSubmit={handleUpdateProfile} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Personal Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px' }} required />
                        </div>
                        <div className="form-group">
                            <label>Vehicle Type</label>
                            <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} required>
                                <option value="bicycle">🚴 Bicycle</option>
                                <option value="motorcycle">🏍️ Motorcycle</option>
                                <option value="car">🚗 Car</option>
                                <option value="walking">🚶 Walking</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-secondary" style={{ marginTop: '1.5rem' }} disabled={loading}>
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>

                <form onSubmit={handleUpdatePassword} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Security</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required placeholder="Min 6 characters" />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                        </div>
                    </div>
                    <button type="submit" className="btn" style={{ marginTop: '1.5rem', backgroundColor: '#eee', color: 'black' }} disabled={loading}>
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VolunteerProfile;
