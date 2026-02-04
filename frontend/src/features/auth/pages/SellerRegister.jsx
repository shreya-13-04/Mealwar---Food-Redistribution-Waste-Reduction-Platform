import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerWithEmail, registerUser } from '../authApi';
import { getDashboardRoute } from '../authUtils';
import { useAuth } from '../../../context/AuthContext';

const SellerRegister = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({
        orgName: '',
        orgType: 'Restaurant',
        contactPerson: '',
        phone: '',
        email: '',
        password: '',
        address: '',
        radius: '5',
        fssai: '',
        foodType: 'Both',
        window: 'Evening'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Firebase Auth
            await registerWithEmail(formData.email, formData.password);

            // 2. Backend Profile
            const userProfile = await registerUser({
                ...formData,
                role: 'FOOD_PROVIDER'
            });

            setUser(userProfile);
            alert('✅ Seller Registration Successful!');
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
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '2.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <h2 style={{ textAlign: 'center', color: 'var(--primary-color)', marginBottom: '2rem' }}>Seller Registration</h2>

                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '5px', marginBottom: '2rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ height: '4px', flex: 1, backgroundColor: i <= step ? 'var(--primary-color)' : '#eee', borderRadius: '2px' }} />
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="form">
                            <h3>Step 1: Basic Information</h3>
                            <div className="form-row">
                                <label>Organization Name</label>
                                <input type="text" name="orgName" required value={formData.orgName} onChange={handleChange} placeholder="e.g. Green Palace Restaurant" />
                            </div>
                            <div className="form-row">
                                <label>Org Type</label>
                                <select name="orgType" value={formData.orgType} onChange={handleChange} className="btn" style={{ background: 'white', color: 'black', border: '1px solid #ccc', textAlign: 'left' }}>
                                    <option>Restaurant</option>
                                    <option>Hotel</option>
                                    <option>Event Organizer</option>
                                    <option>NGO</option>
                                    <option>Store</option>
                                </select>
                            </div>
                            <div className="form-row">
                                <label>Contact Person</label>
                                <input type="text" name="contactPerson" required value={formData.contactPerson} onChange={handleChange} />
                            </div>
                            <div className="form-row">
                                <label>Email Address</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                            </div>
                            <div className="form-row">
                                <label>Password</label>
                                <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Min 6 characters" />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-primary" onClick={nextStep}>Next: Location</button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="form">
                            <h3>Step 2: Location & Address</h3>
                            <div className="form-row">
                                <label>Full Address</label>
                                <textarea name="address" required value={formData.address} onChange={handleChange} style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', minHeight: '100px' }} />
                            </div>
                            <div className="form-row">
                                <label>Service Radius (km)</label>
                                <input type="number" name="radius" value={formData.radius} onChange={handleChange} />
                            </div>
                            <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" className="btn" style={{ background: '#eee', color: 'black' }} onClick={prevStep}>Back</button>
                                <button type="button" className="btn btn-primary" onClick={nextStep}>Next: Legal</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="form">
                            <h3>Step 3: Legal & Operations</h3>
                            <div className="form-row">
                                <label>FSSAI License Number</label>
                                <input type="text" name="fssai" required value={formData.fssai} onChange={handleChange} />
                            </div>
                            <div className="form-row">
                                <label>Typical Food Type</label>
                                <select name="foodType" value={formData.foodType} onChange={handleChange} className="btn" style={{ background: 'white', color: 'black', border: '1px solid #ccc' }}>
                                    <option>Veg Only</option>
                                    <option>Non-Veg Only</option>
                                    <option>Both</option>
                                </select>
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                                    <input type="checkbox" required /> I declare that all food listed will meet the prescribed safety standards.
                                </label>
                            </div>
                            <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" className="btn" style={{ background: '#eee', color: 'black' }} onClick={prevStep}>Back</button>
                                <button type="submit" className="btn btn-primary">Submit Registration</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SellerRegister;
