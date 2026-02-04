import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useListings } from '../../../context/ListingsContext';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const BuyerSearch = () => {
    const { listings } = useListings();
    const navigate = useNavigate();

    // UI State
    const [viewMode, setViewMode] = useState('grid');
    const [activeTab, setActiveTab] = useState('food'); // 'food' or 'restaurants'
    const [showFilters, setShowFilters] = useState(false);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        foodType: 'all',
        minPrice: '',
        maxPrice: '',
        redistributionMode: 'all',
        location: ''
    });

    // Mock coordinates and extra data for listings
    const mapListings = listings.map((l, index) => ({
        ...l,
        position: [28.6139 + (index * 0.012), 77.2090 + (index * 0.008)],
        sellerName: l.sellerName || 'City Central Kitchen',
        sellerRating: 4.5
    }));

    // Filter Logic
    const filteredListings = mapListings.filter(item => {
        const matchesSearch =
            item.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.sellerName && item.sellerName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = filters.foodType === 'all' || item.foodType === filters.foodType;
        const matchesMode = filters.redistributionMode === 'all' || item.redistributionMode === filters.redistributionMode;

        const price = parseFloat(item.price) || 0;
        const minPrice = parseFloat(filters.minPrice) || 0;
        const maxPrice = parseFloat(filters.maxPrice) || Infinity;
        const matchesPrice = price >= minPrice && price <= maxPrice;

        const matchesLocation = !filters.location || item.location.toLowerCase().includes(filters.location.toLowerCase());

        return matchesSearch && matchesType && matchesMode && matchesPrice && matchesLocation;
    });

    // Grouping by Restaurant
    const restaurants = mapListings.reduce((acc, current) => {
        const name = current.sellerName;
        if (!acc[name]) {
            acc[name] = {
                name,
                rating: current.sellerRating,
                location: current.location,
                listings: [],
                position: current.position,
                image: '🏪'
            };
        }
        acc[name].listings.push(current);
        return acc;
    }, {});

    const restaurantList = Object.values(restaurants).filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header Tabs */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                <TabButton active={activeTab === 'food'} onClick={() => setActiveTab('food')}>Browse Food</TabButton>
                <TabButton active={activeTab === 'restaurants'} onClick={() => setActiveTab('restaurants')}>Restaurants near me</TabButton>
            </div>

            {/* Search & Main Interaction */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 3, position: 'relative' }}>
                        <input
                            type="text"
                            placeholder={activeTab === 'food' ? "Search for food, type, or restaurant..." : "Search by restaurant name or area..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', grayscale: 1 }}>🔍</span>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn"
                        style={{ padding: '0 1.5rem', backgroundColor: showFilters ? 'var(--secondary-color)' : '#f5f5f5', color: showFilters ? 'white' : 'black' }}
                    >
                        Filters {Object.values(filters).filter(f => f !== 'all' && f !== '').length > 0 && `(${Object.values(filters).filter(f => f !== 'all' && f !== '').length})`}
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
                        <button
                            className={`btn ${viewMode === 'grid' ? 'btn-secondary' : ''}`}
                            style={{ flex: 1, backgroundColor: viewMode === 'grid' ? '' : '#eee', color: viewMode === 'grid' ? '' : 'black' }}
                            onClick={() => setViewMode('grid')}
                        >
                            Grid
                        </button>
                        <button
                            className={`btn ${viewMode === 'map' ? 'btn-secondary' : ''}`}
                            style={{ flex: 1, backgroundColor: viewMode === 'map' ? '' : '#eee', color: viewMode === 'map' ? '' : 'black' }}
                            onClick={() => setViewMode('map')}
                        >
                            Map
                        </button>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderTop: '1px solid #eee', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Location / Area</label>
                            <input
                                type="text"
                                placeholder="e.g. Downtown"
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Mode</label>
                            <select
                                value={filters.redistributionMode}
                                onChange={(e) => setFilters({ ...filters, redistributionMode: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem' }}
                            >
                                <option value="all">Any Mode</option>
                                <option value="donation">Free / Donation</option>
                                <option value="discounted">Discounted</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Food Category</label>
                            <select
                                value={filters.foodType}
                                onChange={(e) => setFilters({ ...filters, foodType: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem' }}
                            >
                                <option value="all">All Categories</option>
                                <option value="prepared_meal">Prepared Meals</option>
                                <option value="fresh_produce">Fresh Produce</option>
                                <option value="bakery_item">Bakery Items</option>
                                <option value="packaged_food">Packaged Food</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Price Range</label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    style={{ width: '100%', padding: '0.6rem' }}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    style={{ width: '100%', padding: '0.6rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ gridColumn: '1/-1', textAlign: 'right' }}>
                            <button
                                onClick={() => setFilters({ foodType: 'all', minPrice: '', maxPrice: '', redistributionMode: 'all', location: '' })}
                                style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                                Reset All Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Area */}
            <div style={{ flex: 1, position: 'relative', overflowY: viewMode === 'grid' ? 'auto' : 'hidden' }}>
                {activeTab === 'food' ? (
                    viewMode === 'grid' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {filteredListings.length > 0 ? (
                                filteredListings.map(listing => (
                                    <ListingCard key={listing.id} listing={listing} onClick={() => navigate(`/buyer/dashboard/listing/${listing.id}`)} />
                                ))
                            ) : (
                                <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No food items match your criteria.</p>
                            )}
                        </div>
                    ) : (
                        <div style={{ height: '100%', width: '100%', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                            <MapContainer center={[28.6139, 77.2090]} zoom={12} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {filteredListings.map(listing => (
                                    <Marker key={listing.id} position={listing.position}>
                                        <Popup>
                                            <div style={{ minWidth: '150px' }}>
                                                <h4 style={{ margin: '0 0 5px 0' }}>{listing.foodName}</h4>
                                                <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: 'var(--secondary-color)', fontWeight: '700' }}>{listing.redistributionMode === 'donation' ? 'FREE' : `$${listing.price}`}</p>
                                                <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem' }}>🏪 {listing.sellerName}</p>
                                                <button
                                                    onClick={() => navigate(`/buyer/dashboard/listing/${listing.id}`)}
                                                    style={{ width: '100%', padding: '5px', backgroundColor: 'var(--secondary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    )
                ) : (
                    /* RESTAURANT TAB */
                    viewMode === 'grid' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {restaurantList.length > 0 ? (
                                restaurantList.map(restaurant => (
                                    <RestaurantCard key={restaurant.name} restaurant={restaurant} />
                                ))
                            ) : (
                                <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No restaurants found matching your search.</p>
                            )}
                        </div>
                    ) : (
                        <div style={{ height: '100%', width: '100%', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                            <MapContainer center={[28.6139, 77.2090]} zoom={12} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {restaurantList.map(restaurant => (
                                    <Marker key={restaurant.name} position={restaurant.position}>
                                        <Popup>
                                            <div style={{ minWidth: '180px' }}>
                                                <h4 style={{ margin: '0 0 5px 0' }}>{restaurant.name}</h4>
                                                <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem' }}>⭐ {restaurant.rating} Rating</p>
                                                <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem' }}>Available items: {restaurant.listings.length}</p>
                                                <button
                                                    onClick={() => {
                                                        setActiveTab('food');
                                                        setSearchTerm(restaurant.name);
                                                    }}
                                                    style={{ width: '100%', padding: '5px', backgroundColor: 'var(--secondary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Explore Menu
                                                </button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

const TabButton = ({ active, children, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: '1rem 0.5rem',
            border: 'none',
            background: 'none',
            fontSize: '1rem',
            fontWeight: active ? '700' : '500',
            color: active ? 'var(--secondary-color)' : 'var(--text-muted)',
            borderBottom: active ? '3px solid var(--secondary-color)' : 'none',
            cursor: 'pointer'
        }}
    >
        {children}
    </button>
);

const ListingCard = ({ listing, onClick }) => (
    <div
        onClick={onClick}
        style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
        }}
    >
        <div style={{ height: '160px', backgroundColor: '#f0f0f0' }}>
            <img src={listing.imageUrl} alt={listing.foodName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>{listing.foodType.replace('_', ' ')}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: listing.redistributionMode === 'donation' ? 'var(--secondary-color)' : 'var(--primary-color)' }}>
                    {listing.redistributionMode === 'donation' ? 'FREE' : `$${listing.price}`}
                </span>
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{listing.foodName}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>🏪 {listing.sellerName}</span>
                <span>📍 {listing.location}</span>
            </div>
        </div>
    </div>
);

const RestaurantCard = ({ restaurant }) => (
    <div
        style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}
    >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                {restaurant.image}
            </div>
            <div>
                <h4 style={{ margin: 0 }}>{restaurant.name}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {restaurant.location}</p>
                <div style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#fbc02d' }}>★ {restaurant.rating}</span>
                </div>
            </div>
        </div>

        <div style={{ backgroundColor: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', fontWeight: '700' }}>Active Listings ({restaurant.listings.length})</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {restaurant.listings.slice(0, 3).map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>{item.foodName}</span>
                        <span style={{ fontWeight: 'bold', color: item.redistributionMode === 'donation' ? 'var(--secondary-color)' : 'var(--text-main)' }}>
                            {item.redistributionMode === 'donation' ? 'Free' : `$${item.price}`}
                        </span>
                    </div>
                ))}
                {restaurant.listings.length > 3 && (
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>+ {restaurant.listings.length - 3} more items</p>
                )}
            </div>
        </div>

        <button
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.9rem' }}
            onClick={() => {
                alert(`Viewing all listings from ${restaurant.name}`);
            }}
        >
            Explore Options
        </button>
    </div>
);

export default BuyerSearch;
