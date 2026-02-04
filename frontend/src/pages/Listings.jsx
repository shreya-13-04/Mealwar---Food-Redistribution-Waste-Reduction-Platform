import React, { useState } from 'react';
import { useListings } from '../context/ListingsContext';
import { getTimeRemaining, getSafetyLevel } from '../utils/safetyUtils';
import '../App.css'; // Reuse App.css for identical styling

export default function Listings() {
  const { listings } = useListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    mode: 'all',
    foodType: 'all',
    location: '',
    minPrice: '',
    maxPrice: ''
  });

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

  return (
    <div className="listings-page-refactored">
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
    </div>
  );
}
