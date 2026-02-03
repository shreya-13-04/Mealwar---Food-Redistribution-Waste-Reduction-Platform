import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

// Child component to handle map events
function LocationMarker({ position, setPosition, onAddressFound }) {
    const map = useMap();

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            fetchAddress(lat, lng, onAddressFound);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, 15);
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

// Function to fetch address from coordinates using Nominatim
const fetchAddress = async (lat, lng, callback) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data && data.display_name) {
            callback(data.display_name);
        }
    } catch (error) {
        console.error('Error fetching address:', error);
    }
};

const MapPicker = ({ onLocationSelect, onClose }) => {
    const [position, setPosition] = useState([20.5937, 78.9629]); // Default center (India)
    const [loading, setLoading] = useState(false);

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);
                fetchAddress(latitude, longitude, (address) => {
                    onLocationSelect(address);
                    setLoading(false);
                });
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location');
                setLoading(false);
            }
        );
    };

    return (
        <div className="map-modal-overlay">
            <div className="map-modal-content">
                <div className="map-modal-header">
                    <h3>Select Location</h3>
                    <button className="close-map-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="map-container-wrapper">
                    <MapContainer center={position} zoom={5} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker position={position} setPosition={setPosition} onAddressFound={onLocationSelect} />
                    </MapContainer>
                </div>

                <div className="map-modal-footer">
                    <button className="locate-me-btn" onClick={handleLocateMe} disabled={loading}>
                        {loading ? 'Locating...' : '📍 Find My Location'}
                    </button>
                    <button className="confirm-loc-btn" onClick={onClose}>Confirm Location</button>
                </div>
            </div>
        </div>
    );
};

export default MapPicker;
