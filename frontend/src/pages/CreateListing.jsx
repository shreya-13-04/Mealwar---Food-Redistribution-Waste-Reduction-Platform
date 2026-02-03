import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import MapPicker from '../components/MapPicker';
import '../App.css'; // Reuse App.css for identical styling

export default function CreateListing() {
  const { listings, addListing } = useListings();
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
    preparationTime: '',
    preparedAtDateTime: '',
    description: '',
    location: '',
    image: null,
    createdAt: new Date(),
    status: 'active',
    imageUrl: '/food-images/fresh_vegetables_1770067863652.png'
  });
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showMap, setShowMap] = useState(false);

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

    if (!formData.preparationTime) errors.preparationTime = 'Preparation time is required';
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
      id: listings.length + 1,
      ...formData,
      quantity: parseFloat(formData.quantity),
      createdAt: new Date(),
      status: 'active'
    };

    addListing(newListing);

    // Switch to listings view
    navigate('/listings');

    // Show success message
    alert('Listing created successfully!');
  };

  return (
    <div className="create-listing-page-refactored">
      <div className="page-header">
        <h2>Create Food Listing</h2>
        <p>Share your surplus food with the community</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="create-form">
          {/* Food Name */}
          <div className="form-group">
            <label htmlFor="foodName">Food Name *</label>
            <input
              type="text"
              id="foodName"
              name="foodName"
              value={formData.foodName}
              onChange={handleFormChange}
              placeholder="e.g., Fresh Tomatoes, Chicken Biryani"
              className={formErrors.foodName ? 'error' : ''}
            />
            {formErrors.foodName && <span className="error-message">{formErrors.foodName}</span>}
          </div>

          {/* Food Type */}
          <div className="form-group">
            <label htmlFor="foodType">Food Type *</label>
            <select
              id="foodType"
              name="foodType"
              value={formData.foodType}
              onChange={handleFormChange}
              className={formErrors.foodType ? 'error' : ''}
            >
              <option value="">Select food type</option>
              <option value="prepared_meal">Prepared Meal</option>
              <option value="fresh_produce">Fresh Produce</option>
              <option value="packaged_food">Packaged Food</option>
              <option value="bakery_item">Bakery Item</option>
              <option value="dairy_product">Dairy Product</option>
            </select>
            {formErrors.foodType && <span className="error-message">{formErrors.foodType}</span>}
          </div>

          {/* Quantity & Unit */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                placeholder="0"
                min="0"
                step="0.1"
                className={formErrors.quantity ? 'error' : ''}
              />
              {formErrors.quantity && <span className="error-message">{formErrors.quantity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="unit">Unit</label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleFormChange}
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="lb">Pound (lb)</option>
                <option value="pieces">Pieces</option>
                <option value="liters">Liters (L)</option>
              </select>
            </div>
          </div>

          {/* Redistribution Mode */}
          <div className="form-group">
            <label>Redistribution Mode *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="redistributionMode"
                  value="donation"
                  checked={formData.redistributionMode === 'donation'}
                  onChange={handleFormChange}
                />
                <span>Free Donation</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="redistributionMode"
                  value="discounted"
                  checked={formData.redistributionMode === 'discounted'}
                  onChange={handleFormChange}
                />
                <span>Discounted</span>
              </label>
            </div>
          </div>

          {/* Price (Conditional) */}
          {formData.redistributionMode === 'discounted' && (
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                placeholder="e.g., 5.00"
                min="0"
                step="0.01"
                className={formErrors.price ? 'error' : ''}
              />
              {formErrors.price && <span className="error-message">{formErrors.price}</span>}
            </div>
          )}

          {/* Hygiene Status */}
          <div className="form-group">
            <label htmlFor="hygieneStatus">Hygiene Status *</label>
            <select
              id="hygieneStatus"
              name="hygieneStatus"
              value={formData.hygieneStatus}
              onChange={handleFormChange}
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="acceptable">Acceptable</option>
            </select>
          </div>

          {/* Preparation Time */}
          <div className="form-group">
            <label htmlFor="preparationTime">Preparation Time *</label>
            <select
              id="preparationTime"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleFormChange}
              className={formErrors.preparationTime ? 'error' : ''}
            >
              <option value="">When was the food prepared?</option>
              <option value="immediate">Just now (ready to pickup)</option>
              <option value="1hour">1 hour ago</option>
              <option value="2hours">2 hours ago</option>
              <option value="4hours">4 hours ago</option>
              <option value="today">Earlier today</option>
              <option value="yesterday">Yesterday</option>
            </select>
            {formErrors.preparationTime && <span className="error-message">{formErrors.preparationTime}</span>}
          </div>

          {/* Conditional DateTime Picker */}
          {formData.preparationTime === 'immediate' && (
            <div className="form-group">
              <label htmlFor="preparedAtDateTime">Exact Preparation Time *</label>
              <input
                type="datetime-local"
                id="preparedAtDateTime"
                name="preparedAtDateTime"
                value={formData.preparedAtDateTime}
                onChange={handleFormChange}
                max={new Date().toISOString().slice(0, 16)}
              />
              <small style={{ fontSize: '12px', color: '#666' }}>When exactly was this food prepared?</small>
            </div>
          )}

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image">Food Image (Optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData(prev => ({ ...prev, image: file }));
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image: null }));
                    setImagePreview(null);
                  }}
                  style={{ display: 'block', marginTop: '5px', fontSize: '12px' }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Pickup Location *</label>
            <div className="location-inputs">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="e.g., Downtown Community Center"
                className={formErrors.location ? 'error' : ''}
              />
              <div className="location-actions">
                <button
                  type="button"
                  className="location-btn"
                  onClick={() => setShowMap(true)}
                >
                  📍 Current Location / Map
                </button>
                <button
                  type="button"
                  className="location-btn"
                  onClick={() => {
                    // Mock saved address
                    alert('Choosing from saved addresses...');
                    setFormData(prev => ({ ...prev, location: '123 Home Street, Saved Residence' }));
                  }}
                >
                  🏠 Saved Address
                </button>
              </div>
            </div>
            {formErrors.location && <span className="error-message">{formErrors.location}</span>}
          </div>

          {/* Map Modal */}
          {showMap && (
            <MapPicker
              onLocationSelect={(address) => {
                setFormData(prev => ({ ...prev, location: address }));
              }}
              onClose={() => setShowMap(false)}
            />
          )}

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Add any additional details about the food..."
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
}
