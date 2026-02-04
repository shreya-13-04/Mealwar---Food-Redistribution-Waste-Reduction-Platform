import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { updateProfileUser } from '../../auth/authApi';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../../services/firebase';

const SellerProfile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        orgName: user?.orgName || '',
        contactPerson: user?.contactPerson || '',
        phone: user?.phone || '',
        address: user?.address || '',
        orgType: user?.orgType || 'Restaurant',
        radius: user?.radius || '5'
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
            const updatedUser = await updateProfileUser(formData);
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
        if (passwordData.newPassword.length < 6) {
            return setMessage({ type: 'error', text: '❌ Password must be at least 6 characters' });
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
                {/* Basic Info */}
                <form onSubmit={handleUpdateProfile} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Business Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-row">
                            <label>Organization Name</label>
                            <input type="text" name="orgName" value={formData.orgName} onChange={handleChange} required />
                        </div>
                        <div className="form-row">
                            <label>Contact Person</label>
                            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
                        </div>
                        <div className="form-row">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div className="form-row">
                            <label>Organization Type</label>
                            <select name="orgType" value={formData.orgType} onChange={handleChange} className="btn" style={{ background: 'white', border: '1px solid #ccc', color: 'black', textAlign: 'left' }}>
                                <option>Restaurant</option>
                                <option>Hotel</option>
                                <option>Event Organizer</option>
                                <option>NGO</option>
                                <option>Store</option>
                            </select>
                        </div>
                        <div className="form-row" style={{ gridColumn: 'span 2' }}>
                            <label>Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px' }} required />
                        </div>
                        <div className="form-row">
                            <label>Service Radius (km)</label>
                            <input type="number" name="radius" value={formData.radius} onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }} disabled={loading}>
                        {loading ? 'Updating...' : 'Save Profile Changes'}
                    </button>
                </form>

                {/* Change Password */}
                <form onSubmit={handleUpdatePassword} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Security</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-row">
                            <label>New Password</label>
                            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required placeholder="Min 6 characters" />
                        </div>
                        <div className="form-row">
                            <label>Confirm New Password</label>
                            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-secondary" style={{ marginTop: '1.5rem' }} disabled={loading}>
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SellerProfile;
