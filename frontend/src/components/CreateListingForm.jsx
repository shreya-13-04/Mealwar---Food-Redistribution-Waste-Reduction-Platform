import { useState } from 'react';
import { createListing } from '../services/listingService';
import './CreateListingForm.css';

const FOOD_TYPES = [
  'Vegetables',
  'Fruits',
  'Dairy',
  'Bread',
  'Cooked Meals',
  'Pantry Items',
  'Bakery',
  'Other'
];

const REDISTRIBUTION_MODES = [
  { id: 'donation', label: 'Donation', description: 'Free' },
  { id: 'discounted', label: 'Discounted', description: 'Reduced Price' }
];

export default function CreateListingForm() {
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    quantityUnit: 'kg',
    redistributionMode: 'donation',
    preparationTime: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Food Type validation
    if (!formData.foodType.trim()) {
      newErrors.foodType = 'Food type is required';
    }

    // Quantity validation
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    // Preparation Time validation
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

    // Clear error for this field when user starts typing
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate individual field
    const newErrors = { ...errors };
    switch (name) {
      case 'foodType':
        if (!formData.foodType.trim()) {
          newErrors.foodType = 'Food type is required';
        } else {
          delete newErrors.foodType;
        }
        break;
      case 'quantity':
        if (!formData.quantity) {
          newErrors.quantity = 'Quantity is required';
        } else if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
          newErrors.quantity = 'Quantity must be a positive number';
        } else {
          delete newErrors.quantity;
        }
        break;
      case 'preparationTime':
        if (!formData.preparationTime) {
          newErrors.preparationTime = 'Preparation time is required';
        } else {
          delete newErrors.preparationTime;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleRedistributionModeChange = (mode) => {
    setFormData(prev => ({
      ...prev,
      redistributionMode: mode
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      // Prepare data for API
      const listingData = {
        foodType: formData.foodType,
        quantity: parseFloat(formData.quantity),
        quantityUnit: formData.quantityUnit,
        redistributionMode: formData.redistributionMode,
        preparationTime: formData.preparationTime,
        description: formData.description || ''
      };

      // Call the listing service
      const response = await createListing(listingData);

      setSubmitStatus({
        type: 'success',
        message: 'Listing created successfully!'
      });

      // Reset form
      setFormData({
        foodType: '',
        quantity: '',
        quantityUnit: 'kg',
        redistributionMode: 'donation',
        preparationTime: '',
        description: ''
      });
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

  const isFormValid = Object.keys(errors).length === 0 && formData.foodType && formData.quantity && formData.preparationTime;

  return (
    <div className="create-listing-form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Create Food Listing</h2>
          <p>Share your surplus food with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          {/* Food Type Input */}
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
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.foodType && touched.foodType && (
              <span className="error-message">{errors.foodType}</span>
            )}
          </div>

          {/* Quantity Input */}
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
              <label htmlFor="quantityUnit" className="form-label">
                Unit
              </label>
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

          {/* Redistribution Mode */}
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

          {/* Preparation Time */}
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
              <option value="">Select preparation time</option>
              <option value="immediate">Immediate (ready now)</option>
              <option value="1hour">Within 1 hour</option>
              <option value="2hours">Within 2 hours</option>
              <option value="4hours">Within 4 hours</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="custom">Custom time</option>
            </select>
            {errors.preparationTime && touched.preparationTime && (
              <span className="error-message">{errors.preparationTime}</span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional details about the food (e.g., storage conditions, allergens, expiry date)"
              className="form-input form-textarea"
              rows="4"
            />
          </div>

          {/* Status Message */}
          {submitStatus && (
            <div className={`status-message status-${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={`submit-button ${isSubmitting ? 'submitting' : ''} ${!isFormValid ? 'disabled' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creating Listing...
              </>
            ) : (
              'Create Listing'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
