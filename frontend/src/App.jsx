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
    foodType: 'Fresh Vegetables',
    quantity: 10,
    unit: 'kg',
    redistributionMode: 'donation',
    preparationTime: 'immediate',
    description: 'Fresh carrots, tomatoes, and leafy greens from our farm',
    location: 'Downtown Community Center',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: 'active',
    imageUrl: '/food-images/fresh_vegetables_1770067863652.png'
  },
  {
    id: 2,
    foodType: 'Bread & Bakery',
    quantity: 15,
    unit: 'pieces',
    redistributionMode: 'discounted',
    preparationTime: 'today',
    description: 'Assorted bread loaves baked this morning',
    location: 'Main Street Bakery',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    status: 'active',
    imageUrl: '/food-images/bread_bakery_1770067879302.png'
  },
  {
    id: 3,
    foodType: 'Cooked Meals',
    quantity: 20,
    unit: 'portions',
    redistributionMode: 'donation',
    preparationTime: '2hours',
    description: 'Vegetarian rice bowls, ready to eat',
    location: 'City Kitchen',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago - EXPIRED
    status: 'expired',
    imageUrl: '/food-images/cooked_meals_1770067899735.png'
  },
  {
    id: 4,
    foodType: 'Dairy Products',
    quantity: 8,
    unit: 'liters',
    redistributionMode: 'discounted',
    preparationTime: 'immediate',
    description: 'Fresh milk and yogurt',
    location: 'Local Dairy Farm',
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    status: 'active',
    imageUrl: '/food-images/dairy_products_1770067918261.png'
  }
];

function App() {
  const [currentView, setCurrentView] = useState('listings'); // 'listings' or 'create'
  const [listings, setListings] = useState(mockListings);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    unit: 'kg',
    redistributionMode: 'donation',
    preparationTime: 'immediate',
    description: '',
    location: '',
    createdAt: new Date(),
    status: 'active',
    imageUrl: '/food-images/fresh_vegetables_1770067863652.png' // default image
  });
  const [formErrors, setFormErrors] = useState({});

  const filteredListings = listings.filter(item => {
    const matchesSearch =
      item.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all' || item.redistributionMode === filter;

    return matchesSearch && matchesFilter;
  });

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
    if (!formData.foodType.trim()) errors.foodType = 'Food type is required';
    if (!formData.quantity || formData.quantity <= 0) errors.quantity = 'Valid quantity is required';
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
      quantity: parseFloat(formData.quantity)
    };

    setListings(prev => [newListing, ...prev]);

    // Reset form
    setFormData({
      foodType: '',
      quantity: '',
      unit: 'kg',
      redistributionMode: 'donation',
      preparationTime: 'immediate',
      description: '',
      location: '',
      createdAt: new Date(),
      status: 'active',
      imageUrl: '/food-images/fresh_vegetables_1770067863652.png'
    });

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
                <input
                  type="text"
                  placeholder="Search food items..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All Items
                  </button>
                  <button
                    className={`filter-btn ${filter === 'donation' ? 'active' : ''}`}
                    onClick={() => setFilter('donation')}
                  >
                    Free Donation
                  </button>
                  <button
                    className={`filter-btn ${filter === 'discounted' ? 'active' : ''}`}
                    onClick={() => setFilter('discounted')}
                  >
                    Discounted
                  </button>
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
                        <h3>{listing.foodType}</h3>
                        <p className="quantity">
                          <strong>Quantity:</strong> {listing.quantity} {listing.unit}
                        </p>
                        <p className="description">{listing.description}</p>
                        <p className="location">Location: {listing.location}</p>

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
                  {/* Food Type */}
                  <div className="form-group">
                    <label htmlFor="foodType">Food Type *</label>
                    <input
                      type="text"
                      id="foodType"
                      name="foodType"
                      value={formData.foodType}
                      onChange={handleFormChange}
                      placeholder="e.g., Fresh Vegetables, Bread, Cooked Meals"
                      className={formErrors.foodType ? 'error' : ''}
                    />
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
                        <option value="liters">Liters (L)</option>
                        <option value="pieces">Pieces</option>
                        <option value="portions">Portions</option>
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

                  {/* Preparation Time */}
                  <div className="form-group">
                    <label htmlFor="preparationTime">Preparation Time *</label>
                    <select
                      id="preparationTime"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleFormChange}
                    >
                      <option value="immediate">Immediate (ready now)</option>
                      <option value="1hour">Within 1 hour</option>
                      <option value="2hours">Within 2 hours</option>
                      <option value="4hours">Within 4 hours</option>
                      <option value="today">Today</option>
                      <option value="tomorrow">Tomorrow</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="form-group">
                    <label htmlFor="location">Pickup Location *</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      placeholder="e.g., Downtown Community Center"
                      className={formErrors.location ? 'error' : ''}
                    />
                    {formErrors.location && <span className="error-message">{formErrors.location}</span>}
                  </div>

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
