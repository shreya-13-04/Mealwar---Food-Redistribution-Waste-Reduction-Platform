import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerWithEmail, registerUser } from '../authApi';
import { getDashboardRoute } from '../authUtils';
import { useAuth } from '../../../context/AuthContext';

const BuyerRegister = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        location: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Firebase Auth
            await registerWithEmail(formData.email, formData.password);

            // 2. Backend Profile
            const userProfile = await registerUser({
                ...formData,
                role: 'BUYER'
            });

            setUser(userProfile);
            alert('✅ Registration Successful!');
            navigate(getDashboardRoute(userProfile.role));
        } catch (error) {
            console.error('Registration error:', error);
            alert('❌ Registration failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ maxWidth: '450px', margin: '0 auto', background: 'white', padding: '2.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <h2 style={{ textAlign: 'center', color: 'var(--secondary-color)', marginBottom: '1.5rem' }}>Find Food</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Register to see surplus food availability near you.</p>

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-row">
                        <label>Name (Optional)</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
                    </div>
                    <div className="form-row">
                        <label>Email Address</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                    </div>
                    <div className="form-row">
                        <label>Password</label>
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Min 6 characters" />
                    </div>
                    <div className="form-row">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+91 XXXX XXX XXX" />
                    </div>
                    <div className="form-row">
                        <label>Current Location / Area</label>
                        <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. Indiranagar, Bangalore" />
                    </div>

                    <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Get Started</button>
                </form>
            </div>
        </div>
    );
};

export default BuyerRegister;
