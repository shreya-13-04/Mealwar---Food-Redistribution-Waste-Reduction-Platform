import "./App.css";
import { loginAndGetToken } from "./services/authService";

function App() {
  const handleTestLogin = async () => {
    try {
      const token = await loginAndGetToken(
        "test@gmail.com",
        "test1234"
      );

      console.log("✅ FIREBASE JWT TOKEN:");
      console.log(token);
    } catch (error) {
      console.error("❌ Firebase Login Failed:", error);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Mealwar – Authentication Test</h1>

      <p>
        This is a temporary UI to validate Firebase Authentication
        and backend JWT verification.
      </p>

      <button
        onClick={handleTestLogin}
        style={{
          padding: "10px 16px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Test Firebase Login
      </button>

      <p style={{ marginTop: "1rem", color: "#666" }}>
        Open DevTools → Console to view the JWT token.
      </p>
import { useState, useEffect } from 'react';
import './App.css';
import MapPicker from './components/MapPicker';

// Helper function to calculate time remaining
const getTimeRemaining = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const hoursElapsed = (now - created) / (1000 * 60 * 60);
  const hoursRemaining = 4 - hoursElapsed; // 4 hour safety window

  if (hoursRemaining <= 0) return { hours: 0, minutes: 0, expired: true };

  const hours = Math.floor(hoursRemaining);
  const minutes = Math.floor((hoursRemaining - hours) * 60);

  return { hours, minutes, expired: false };
};

// Helper function to get safety level
const getSafetyLevel = (createdAt) => {
  const remaining = getTimeRemaining(createdAt);
  if (remaining.expired) return 'expired';

  const totalMinutes = remaining.hours * 60 + remaining.minutes;
  if (totalMinutes > 180) return 'safe'; // > 3 hours
  if (totalMinutes > 60) return 'warning'; // 1-3 hours
  return 'critical'; // < 1 hour
};


// Mock data for now - will connect to backend later
const mockListings = [
  {
    id: 1,
    foodName: 'Garden Fresh Tomatoes',
    foodType: 'fresh_produce',
    quantity: 10,
    unit: 'kg',
    redistributionMode: 'donation',
    hygieneStatus: 'excellent',
    preparationTime: 'immediate',
    description: 'Fresh organic tomatoes from our local community garden.',
    location: 'Downtown Community Center',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: 'active',
    imageUrl: '/food-images/fresh_vegetables_1770067863652.png'
  },
  {
    id: 2,
    foodName: 'Assorted Morning Pastries',
    foodType: 'bakery_item',
    quantity: 15,
    unit: 'pieces',
    redistributionMode: 'discounted',
    hygieneStatus: 'good',
    preparationTime: 'today',
    description: 'Mixed croissants and muffins baked early this morning.',
    location: 'Main Street Bakery',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    status: 'active',
    imageUrl: '/food-images/bread_bakery_1770067879302.png'
  },
  {
    id: 3,
    foodName: 'Vegetarian Biryani Bowls',
    foodType: 'prepared_meal',
    quantity: 20,
    unit: 'portions',
    redistributionMode: 'donation',
    hygieneStatus: 'excellent',
    preparationTime: '2hours',
    description: 'Nutritious vegetable biryani, perfectly packed and ready to eat.',
    location: 'City Kitchen',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago - EXPIRED
    status: 'expired',
    imageUrl: '/food-images/cooked_meals_1770067899735.png'
  }
];

function App() {
  const [currentView, setCurrentView] = useState('listings'); // 'listings' or 'create'
  const [listings, setListings] = useState(mockListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    mode: 'all',
    foodType: 'all',
    location: '',
    minPrice: '',
    maxPrice: ''
  });

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

  const filteredListings = listings.filter(item => {
    // Search term (name, type, or description)
    const matchesSearch =
      item.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by redistribution mode
    const matchesMode =
      filters.mode === 'all' || item.redistributionMode === filters.mode;

    // Filter by food type
    const matchesFoodType =
      filters.foodType === 'all' || item.foodType === filters.foodType;

    // Filter by location
    const matchesLocation =
      !filters.location || item.location.toLowerCase().includes(filters.location.toLowerCase());

    // Filter by price range
    const itemPrice = item.price || 0;
    const matchesMinPrice = !filters.minPrice || itemPrice >= parseFloat(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || itemPrice <= parseFloat(filters.maxPrice);

    return matchesSearch && matchesMode && matchesFoodType && matchesLocation && matchesMinPrice && matchesMaxPrice;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      mode: 'all',
      foodType: 'all',
      location: '',
      minPrice: '',
      maxPrice: ''
    });
  };

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

    // Add new listing
    const newListing = {
      id: listings.length + 1,
      ...formData,
      quantity: parseFloat(formData.quantity),
      createdAt: new Date(),
      status: 'active'
    };

    setListings(prev => [newListing, ...prev]);

    // Reset form
    setFormData({
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
    setImagePreview(null);

    // Switch to listings view
    setCurrentView('listings');

    // Show success message (you could add a toast notification here)
    alert('Listing created successfully!');
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo-wrapper">
            <h1 className="logo">MealWar</h1>
            <svg className="leaf-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12 2 12 6 10 10C8 14 4 15 4 15C4 15 8 16 10 20C12 24 12 22 12 22C12 22 12 24 14 20C16 16 20 15 20 15C20 15 16 14 14 10C12 6 12 2 12 2Z" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
          <p className="tagline">Reducing Food Waste, Feeding Communities</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <button
            className={`nav-btn ${currentView === 'listings' ? 'active' : ''}`}
            onClick={() => setCurrentView('listings')}
          >
            View Listings
          </button>
          <button
            className={`nav-btn ${currentView === 'create' ? 'active' : ''}`}
            onClick={() => setCurrentView('create')}
          >
            Create Listing
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {currentView === 'listings' ? (
            <>
              {/* Page Title */}
              <div className="page-header">
                <h2>Available Surplus Food</h2>
                <p>Find fresh food in your area and help reduce waste</p>
              </div>

              {/* Search & Filters */}
              <div className="controls">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search food by name, type, or description..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="advanced-filters">
                  <div className="filter-group">
                    <label>Food Type</label>
                    <select
                      className="filter-select"
                      value={filters.foodType}
                      onChange={(e) => setFilters(prev => ({ ...prev, foodType: e.target.value }))}
                    >
                      <option value="all">All Types</option>
                      <option value="prepared_meal">Prepared Meals</option>
                      <option value="fresh_produce">Fresh Produce</option>
                      <option value="packaged_food">Packaged Food</option>
                      <option value="bakery_item">Bakery Items</option>
                      <option value="dairy_product">Dairy Products</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Location</label>
                    <input
                      type="text"
                      placeholder="City or area..."
                      className="filter-input"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  <div className="filter-group">
                    <label>Mode</label>
                    <div className="filter-mode-buttons">
                      <button
                        className={`mini-filter-btn ${filters.mode === 'all' ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, mode: 'all' }))}
                      >
                        All
                      </button>
                      <button
                        className={`mini-filter-btn ${filters.mode === 'donation' ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, mode: 'donation' }))}
                      >
                        Free
                      </button>
                      <button
                        className={`mini-filter-btn ${filters.mode === 'discounted' ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({ ...prev, mode: 'discounted' }))}
                      >
                        Paid
                      </button>
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>Price Range ($)</label>
                    <div className="price-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        className="filter-input price-input"
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="filter-input price-input"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="filter-actions">
                    <button className="clear-filters-btn" onClick={clearFilters}>
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Listings Grid */}
              <div className="listings-grid">
                {filteredListings.length === 0 ? (
                  <div className="empty-state">
                    <p>No listings found. Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  filteredListings.map(listing => (
                    <article key={listing.id} className="listing-card">
                      {/* Card Header */}
                      <div className="card-header">
                        <div className="header-left">
                          <span className={`badge ${listing.redistributionMode === 'donation' ? 'badge-donation' : 'badge-discount'}`}>
                            {listing.redistributionMode === 'donation' ? 'Free' : 'Discounted'}
                          </span>
                          <span className={`status-badge ${listing.status === 'active' ? 'status-active' : 'status-expired'}`}>
                            {listing.status === 'active' ? 'Active' : 'Expired'}
                          </span>
                        </div>
                        <span className="time-badge">{listing.preparationTime}</span>
                      </div>

                      {/* Food Image */}
                      <div className="food-image-container">
                        <img
                          src={listing.imageUrl}
                          alt={listing.foodType}
                          className="food-image"
                        />
                      </div>

                      {/* Card Content */}
                      <div className="card-content">
                        <h3>{listing.foodName}</h3>
                        <p className="food-type-tag">{listing.foodType.replace('_', ' ')}</p>
                        <p className="quantity">
                          <strong>Quantity:</strong> {listing.quantity} {listing.unit}
                        </p>
                        <p className="hygiene">
                          <strong>Hygiene:</strong> <span className={`hygiene-${listing.hygieneStatus}`}>{listing.hygieneStatus}</span>
                        </p>
                        <p className="description">{listing.description}</p>
                        <p className="location">Location: {listing.location}</p>

                        {listing.redistributionMode === 'discounted' && listing.price && (
                          <p className="price-display">Price: ${listing.price}</p>
                        )}

                        {/* Safety Indicator */}
                        {(() => {
                          const safetyLevel = getSafetyLevel(listing.createdAt);
                          const timeRemaining = getTimeRemaining(listing.createdAt);

                          return (
                            <div className={`safety-indicator safety-${safetyLevel}`}>
                              {safetyLevel === 'expired' && (
                                <span>Expired - Not safe to consume</span>
                              )}
                              {safetyLevel === 'critical' && (
                                <span>Critical - Expires in {timeRemaining.minutes}m</span>
                              )}
                              {safetyLevel === 'warning' && (
                                <span>Warning - Expires in {timeRemaining.hours}h {timeRemaining.minutes}m</span>
                              )}
                              {safetyLevel === 'safe' && (
                                <span>Safe - {timeRemaining.hours}h {timeRemaining.minutes}m remaining</span>
                              )}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Card Actions */}
                      <div className="card-actions">
                        <button className="claim-btn">
                          Claim Food
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              {/* Create Listing Form */}
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
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2026 MealWar - Food Redistribution Platform</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
