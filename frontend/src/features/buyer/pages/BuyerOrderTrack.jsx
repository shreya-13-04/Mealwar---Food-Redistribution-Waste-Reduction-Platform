import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icons
const volunteerIcon = L.divIcon({
    html: '🚴',
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

const BuyerOrderTrack = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    // Simulated volunteer movement
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => (prev < 100 ? prev + 5 : 100));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const sellerPos = [28.6139, 77.2090];
    const buyerPos = [28.6250, 77.2200];

    // Interpolated volunteer position
    const volunteerPos = [
        sellerPos[0] + (buyerPos[0] - sellerPos[0]) * (progress / 100),
        sellerPos[1] + (buyerPos[1] - sellerPos[1]) * (progress / 100)
    ];

    return (
        <div style={{ height: 'calc(100vh - 120px)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ backgroundColor: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', boxShadow: 'var(--shadow)', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    ← Back to Order
                </button>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow)', width: '300px' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Estimated Delivery</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary-color)' }}>12:15 PM</span>
                        <span style={{ color: 'var(--text-muted)' }}>{100 - progress}% remaining</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--secondary-color)', transition: 'width 0.5s ease-out' }}></div>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Rajesh Kumar is delivering your order from <strong>Bakery Street</strong>.
                    </p>
                </div>
            </div>

            <MapContainer center={volunteerPos} zoom={14} style={{ height: '100%', width: '100%', borderRadius: 'var(--radius)' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={sellerPos}><Popup>Pick-up Point</Popup></Marker>
                <Marker position={buyerPos}><Popup>Your Location</Popup></Marker>
                <Marker position={volunteerPos} icon={volunteerIcon}><Popup>Volunteer (Rajesh)</Popup></Marker>
                <Polyline positions={[sellerPos, buyerPos]} color="grey" dashArray="5, 10" weight={2} />
                <Polyline positions={[sellerPos, volunteerPos]} color="var(--secondary-color)" weight={4} />
            </MapContainer>
        </div>
    );
};

export default BuyerOrderTrack;
