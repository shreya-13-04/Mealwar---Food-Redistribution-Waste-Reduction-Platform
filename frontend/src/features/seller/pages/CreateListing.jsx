import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../../../context/ListingsContext';
import { useAuth } from '../../../context/AuthContext';
import MapPicker from '../../../components/MapPicker';
import '../../../App.css';

export default function CreateListing() {
    const { addListing } = useListings();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        foodName: '',
        foodType: '',
        quantity: '',
        unit: 'kg',
        redistributionMode: 'donation',
        price: '',
        hygieneStatus: 'good',
        preparationTime: 'immediate',
        preparedAtDateTime: new Date().toISOString().slice(0, 16),
        description: '',
        location: user?.address || '', // Pre-populate from seller profile
        image: null,
        createdAt: new Date(),
        status: 'active'
    });

    const [formErrors, setFormErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [showMap, setShowMap] = useState(false);

    // Update location if user profile loads later
    useEffect(() => {
        if (user?.address && !formData.location) {
            setFormData(prev => ({ ...prev, location: user.address }));
        }
    }, [user]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.foodName.trim()) errors.foodName = 'Food name is required';
        if (!formData.foodType.trim()) errors.foodType = 'Food type is required';
        if (!formData.quantity || formData.quantity <= 0) errors.quantity = 'Valid quantity is required';

        if (formData.redistributionMode === 'discounted') {
            if (!formData.price) {
                errors.price = 'Price is required for discounted items';
            } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
                errors.price = 'Price must be a positive number';
            }
        }

        if (!formData.location.trim()) errors.location = 'Location is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Add new listing via context
        const newListing = {
            id: Date.now(),
            ...formData,
            quantity: parseFloat(formData.quantity),
            createdAt: new Date(),
            status: 'active'
        };

        addListing(newListing);

        // Switch to listings view
        navigate('/seller/dashboard/listings');

        // Show success message
        alert('✅ Food listing created successfully!');
    };

    return (
        <div className="create-listing-page-refactored">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h2>Create New Food Listing</h2>
                <p>Your business location is pre-filled for your convenience.</p>
            </div>

            <div className="form-container" style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <form onSubmit={handleSubmit} className="create-form">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {/* Food Name */}
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Food Item Name *</label>
                            <input
                                type="text"
                                name="foodName"
                                value={formData.foodName}
                                onChange={handleFormChange}
                                placeholder="e.g., 10 Packs of Mixed Veg Curry"
                                className={formErrors.foodName ? 'error' : ''}
                            />
                            {formErrors.foodName && <span className="error-message">{formErrors.foodName}</span>}
                        </div>

                        {/* Food Type */}
                        <div className="form-group">
                            <label>Food Type *</label>
                            <select
                                name="foodType"
                                value={formData.foodType}
                                onChange={handleFormChange}
                                className={formErrors.foodType ? 'error' : ''}
                            >
                                <option value="">Select type</option>
                                <option value="prepared_meal">Prepared Meal</option>
                                <option value="fresh_produce">Fresh Produce</option>
                                <option value="packaged_food">Packaged Food</option>
                                <option value="bakery_item">Bakery Item</option>
                            </select>
                            {formErrors.foodType && <span className="error-message">{formErrors.foodType}</span>}
                        </div>

                        {/* Quantity */}
                        <div className="form-group">
                            <label>Quantity *</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleFormChange}
                                    placeholder="Qty"
                                    style={{ flex: 1 }}
                                    className={formErrors.quantity ? 'error' : ''}
                                />
                                <select name="unit" value={formData.unit} onChange={handleFormChange} style={{ width: '80px' }}>
                                    <option value="kg">kg</option>
                                    <option value="portions">portions</option>
                                    <option value="pieces">pcs</option>
                                </select>
                            </div>
                            {formErrors.quantity && <span className="error-message">{formErrors.quantity}</span>}
                        </div>

                        {/* Mode */}
                        <div className="form-group">
                            <label>Redistribution Mode *</label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="radio" name="redistributionMode" value="donation" checked={formData.redistributionMode === 'donation'} onChange={handleFormChange} />
                                    Free
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="radio" name="redistributionMode" value="discounted" checked={formData.redistributionMode === 'discounted'} onChange={handleFormChange} />
                                    Discount
                                </label>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="form-group">
                            <label>Price {formData.redistributionMode === 'discounted' ? '*' : '(Disabled)'}</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleFormChange}
                                disabled={formData.redistributionMode === 'donation'}
                                placeholder="0.00"
                                className={formErrors.price ? 'error' : ''}
                            />
                            {formErrors.price && <span className="error-message">{formErrors.price}</span>}
                        </div>

                        {/* Timing */}
                        <div className="form-group">
                            <label>Prepared At *</label>
                            <input type="datetime-local" name="preparedAtDateTime" value={formData.preparedAtDateTime} onChange={handleFormChange} />
                        </div>

                        <div className="form-group">
                            <label>Hygiene Status</label>
                            <select name="hygieneStatus" value={formData.hygieneStatus} onChange={handleFormChange}>
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="acceptable">Acceptable</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Pickup Location / Address *</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleFormChange}
                                    className={formErrors.location ? 'error' : ''}
                                    style={{ flex: 1 }}
                                />
                                <button type="button" className="btn" onClick={() => setShowMap(true)} style={{ padding: '0 1rem', background: '#eee', color: 'black' }}>📍 Map</button>
                            </div>
                            {formErrors.location && <span className="error-message">{formErrors.location}</span>}

                            {showMap && (
                <MapPicker
                    onLocationSelect={(address) => {
                        setFormData(prev => ({ ...prev, location: address }));
                    }}
                    onClose={() => setShowMap(false)}
                />
            )}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label>Description (Optional)</label>
                        <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" placeholder="Any special handling instructions..." style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                    </div>

                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Publish Listing</button>
                        <button type="button" className="btn" style={{ flex: 1, backgroundColor: '#eee', color: 'black' }} onClick={() => navigate(-1)}>Cancel</button>
                    </div>
                </form>
            </div>

            
        </div>
    );
}
