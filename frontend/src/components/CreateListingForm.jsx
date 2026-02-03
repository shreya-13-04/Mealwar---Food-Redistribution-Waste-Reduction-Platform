import React, { useState, useEffect } from 'react';
import { createListing } from '../services/listingService';
import './CreateListingForm.css';
import MapPicker from './MapPicker';

const FOOD_TYPES = [
  { value: 'prepared_meal', label: 'Prepared Meal' },
  { value: 'fresh_produce', label: 'Fresh Produce' },
  { value: 'packaged_food', label: 'Packaged Food' },
  { value: 'bakery_item', label: 'Bakery Item' },
  { value: 'dairy_product', label: 'Dairy Product' }
];

const HYGIENE_STATUS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'acceptable', label: 'Acceptable' }
];

const REDISTRIBUTION_MODES = [
  { id: 'donation', label: 'Donation', description: 'Free' },
  { id: 'discounted', label: 'Discounted', description: 'Reduced Price' }
];

export default function CreateListingForm() {
  const [formData, setFormData] = useState({
    foodName: '',
    foodType: '',
    quantity: '',
    quantityUnit: 'kg',
    redistributionMode: 'donation',
    price: '',
    hygieneStatus: 'good',
    preparationTime: '',
    preparedAtDateTime: '',
    description: '',
    image: null,
    location: ''
  });

  const [showMap, setShowMap] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.foodName.trim()) {
      newErrors.foodName = 'Food name is required';
    }

    if (!formData.location || !formData.location.trim()) {
      newErrors.location = 'Pickup location is required';
    }

    if (!formData.foodType.trim()) {
      newErrors.foodType = 'Food type is required';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    if (formData.redistributionMode === 'discounted') {
      if (!formData.price) {
        newErrors.price = 'Price is required for discounted items';
      } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }

    if (!formData.preparationTime) {
      newErrors.preparationTime = 'Preparation time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateForm();
  };

  const handleRedistributionModeChange = (mode) => {
    setFormData(prev => ({
      ...prev,
      redistributionMode: mode,
      price: mode === 'donation' ? '' : prev.price
    }));

    if (mode === 'donation') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.price;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allFieldsTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allFieldsTouched);

    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fix the errors above before submitting.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const listingData = {
        foodName: formData.foodName,
        foodType: formData.foodType,
        quantity: parseFloat(formData.quantity),
        quantityUnit: formData.quantityUnit,
        redistributionMode: formData.redistributionMode,
        price: formData.redistributionMode === 'discounted' ? parseFloat(formData.price) : undefined,
        hygieneStatus: formData.hygieneStatus,
        preparationTime: formData.preparationTime,
        preparedAtDateTime: formData.preparedAtDateTime || '',
        description: formData.description || '',
        location: formData.location
      };

      await createListing(listingData);

      setSubmitStatus({
        type: 'success',
        message: 'Listing created successfully!'
      });

      setFormData({
        foodName: '',
        foodType: '',
        quantity: '',
        quantityUnit: 'kg',
        redistributionMode: 'donation',
        price: '',
        hygieneStatus: 'good',
        preparationTime: '',
        preparedAtDateTime: '',
        description: '',
        image: null,
        location: ''
      });
      setImagePreview(null);
      setErrors({});
      setTouched({});
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to create listing. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Object.keys(errors).length === 0 &&
    formData.foodName &&
    formData.foodType &&
    formData.quantity &&
    formData.preparationTime &&
    formData.location &&
    (formData.redistributionMode === 'donation' || (formData.redistributionMode === 'discounted' && formData.price));

  return (
    <div className="create-listing-form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Create Food Listing</h2>
          <p>Share your surplus food with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className={`form-group ${errors.foodName && touched.foodName ? 'error' : ''}`}>
            <label htmlFor="foodName" className="form-label">
              Food Name <span className="required">*</span>
            </label>
            <input
              id="foodName"
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Fresh Tomatoes, Chicken Biryani"
              className={`form-input ${errors.foodName && touched.foodName ? 'input-error' : ''}`}
            />
            {errors.foodName && touched.foodName && (
              <span className="error-message">{errors.foodName}</span>
            )}
          </div>

          <div className={`form-group ${errors.location && touched.location ? 'error' : ''}`}>
            <label htmlFor="location" className="form-label">
              Pickup Location <span className="required">*</span>
            </label>
            <div className="location-selection-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter pickup address or select from map"
                className={`form-input ${errors.location && touched.location ? 'input-error' : ''}`}
              />
              <div className="location-buttons" style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowMap(true)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', background: '#2a2340', color: '#fff', border: '1px solid #3d3555' }}
                >
                  📍 Current Location / Map
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    alert('Choosing from saved addresses...');
                    setFormData(prev => ({ ...prev, location: '123 Home Street, Saved Residence' }));
                  }}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', background: '#2a2340', color: '#fff', border: '1px solid #3d3555' }}
                >
                  🏠 Saved Address
                </button>
              </div>
            </div>
            {errors.location && touched.location && (
              <span className="error-message">{errors.location}</span>
            )}
          </div>

          {showMap && (
            <MapPicker
              onLocationSelect={(address) => {
                setFormData(prev => ({ ...prev, location: address }));
                setShowMap(false);
              }}
              onClose={() => setShowMap(false)}
            />
          )}

          <div className={`form-group ${errors.foodType && touched.foodType ? 'error' : ''}`}>
            <label htmlFor="foodType" className="form-label">
              Food Type <span className="required">*</span>
            </label>
            <select
              id="foodType"
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input form-select ${errors.foodType && touched.foodType ? 'input-error' : ''}`}
            >
              <option value="">Select food type</option>
              {FOOD_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.foodType && touched.foodType && (
              <span className="error-message">{errors.foodType}</span>
            )}
          </div>

          <div className="form-row">
            <div className={`form-group ${errors.quantity && touched.quantity ? 'error' : ''}`}>
              <label htmlFor="quantity" className="form-label">
                Quantity <span className="required">*</span>
              </label>
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.0"
                step="0.1"
                min="0"
                className={`form-input ${errors.quantity && touched.quantity ? 'input-error' : ''}`}
              />
              {errors.quantity && touched.quantity && (
                <span className="error-message">{errors.quantity}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="quantityUnit" className="form-label">Unit</label>
              <select
                id="quantityUnit"
                name="quantityUnit"
                value={formData.quantityUnit}
                onChange={handleChange}
                className="form-input form-select"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="lb">Pound (lb)</option>
                <option value="pieces">Pieces</option>
                <option value="liters">Liters (L)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Redistribution Mode <span className="required">*</span>
            </label>
            <div className="mode-selector">
              {REDISTRIBUTION_MODES.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  className={`mode-button ${formData.redistributionMode === mode.id ? 'mode-active' : ''}`}
                  onClick={() => handleRedistributionModeChange(mode.id)}
                >
                  <div className="mode-label">{mode.label}</div>
                  <div className="mode-description">{mode.description}</div>
                </button>
              ))}
            </div>
          </div>

          {formData.redistributionMode === 'discounted' && (
            <div className={`form-group slide-in ${errors.price && touched.price ? 'error' : ''}`}>
              <label htmlFor="price" className="form-label">
                Price ($) <span className="required">*</span>
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`form-input ${errors.price && touched.price ? 'input-error' : ''}`}
              />
              {errors.price && touched.price && (
                <span className="error-message">{errors.price}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="hygieneStatus" className="form-label">
              Hygiene Status <span className="required">*</span>
            </label>
            <select
              id="hygieneStatus"
              name="hygieneStatus"
              value={formData.hygieneStatus}
              onChange={handleChange}
              className="form-input form-select"
            >
              {HYGIENE_STATUS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className={`form-group ${errors.preparationTime && touched.preparationTime ? 'error' : ''}`}>
            <label htmlFor="preparationTime" className="form-label">
              Preparation Time <span className="required">*</span>
            </label>
            <select
              id="preparationTime"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input form-select ${errors.preparationTime && touched.preparationTime ? 'input-error' : ''}`}
            >
              <option value="">When was the food prepared?</option>
              <option value="immediate">Just now (ready to pickup)</option>
              <option value="1hour">1 hour ago</option>
              <option value="2hours">2 hours ago</option>
              <option value="4hours">4 hours ago</option>
              <option value="today">Earlier today</option>
              <option value="yesterday">Yesterday</option>
            </select>
            {errors.preparationTime && touched.preparationTime && (
              <span className="error-message">{errors.preparationTime}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image" className="form-label">Food Image (Optional)</label>
            <input
              id="image"
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData(prev => ({ ...prev, image: file }));
                  const reader = new FileReader();
                  reader.onloadend = () => setImagePreview(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
              className="form-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Food preview" style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '8px' }} />
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image: null }));
                    setImagePreview(null);
                  }}
                  className="remove-image-btn"
                  style={{ display: 'block', marginTop: '5px', fontSize: '12px' }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional details about the food"
              className="form-input form-textarea"
              rows="4"
            />
          </div>

          {submitStatus && (
            <div className={`status-message status-${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={`submit-button ${isSubmitting ? 'submitting' : ''} ${!isFormValid ? 'disabled' : ''}`}
          >
            {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
