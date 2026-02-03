import { useState, useEffect } from 'react';
import { getListings } from '../services/listingService';
import ListingCard from '../components/ListingCard';
import '../components/Listings.css';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, donation, discounted
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await getListings();
      // Backend returns { success: true, data: [...] }
      if (response.data && response.data.success) {
        setListings(response.data.data);
      } else {
        // Fallback or handle unexpected format
        setListings(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError('Failed to load listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(item => {
    const matchesSearch = (item.foodType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === 'all' || item.redistributionMode === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="listings-page">
      <div className="head-section">
        <h2>Available Surplus Food</h2>
        <p className="subtitle">Find fresh food in your area and help reduce waste.</p>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search food items..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-group">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'donation' ? 'active' : ''}`}
            onClick={() => setFilter('donation')}
          >
            Donation (Free)
          </button>
          <button
            className={`filter-btn ${filter === 'discounted' ? 'active' : ''}`}
            onClick={() => setFilter('discounted')}
          >
            Discounted
          </button>
        </div>
      </div>

      {loading && <div className="loading-state">Loading listings...</div>}

      {error && <div className="error-state">{error}</div>}

      {!loading && !error && filteredListings.length === 0 && (
        <div className="empty-state">
          <h3>No listings found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      <div className="listings-grid">
        {filteredListings.map(listing => (
          <ListingCard key={listing._id || listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
