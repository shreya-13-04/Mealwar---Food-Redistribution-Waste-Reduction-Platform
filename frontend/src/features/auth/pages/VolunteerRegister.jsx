import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerWithEmail, registerUser } from '../authApi';
import { getDashboardRoute } from '../authUtils';
import { useAuth } from '../../../context/AuthContext';

const VolunteerRegister = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        transport: 'cycle'
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
                role: 'VOLUNTEER'
            });

            setUser(userProfile);
            alert('✅ Volunteer Registration Successful!');
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
                <h2 style={{ textAlign: 'center', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Become a Volunteer</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Help us deliver surplus food to those who need it most.</p>

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-row">
                        <label>Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label>Email Address</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <label>Password</label>
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Min 6 characters" />
                    </div>
                    <div className="form-row">
                        <label>Transport Mode</label>
                        <select name="transport" value={formData.transport} onChange={handleChange} className="btn" style={{ background: 'white', color: 'black', border: '1px solid #ccc', textAlign: 'left' }}>
                            <option value="walk">Walking</option>
                            <option value="cycle">Cycle</option>
                            <option value="bike">Motorcycle / Scooter</option>
                            <option value="car">Car / Van</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register as Volunteer</button>
                </form>
            </div>
        </div>
    );
};

export default VolunteerRegister;
