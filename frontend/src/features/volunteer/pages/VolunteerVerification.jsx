import React, { useState } from 'react';

const VolunteerVerification = () => {
    const [verificationStatus] = useState({
        email: true,
        idUpload: false,
        transport: false
    });

    const [uploadedId, setUploadedId] = useState(null);
    const [transportType, setTransportType] = useState('');

    const handleIdUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedId(file.name);
            alert('ID uploaded successfully! It will be reviewed within 24 hours.');
        }
    };

    const handleTransportSubmit = () => {
        if (transportType) {
            alert(`Transport type "${transportType}" submitted for verification!`);
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>Verification Status</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Step 1: Email Verification */}
                <VerificationStep
                    icon="📧"
                    title="Email Verification"
                    description="Verify your email address to receive delivery notifications"
                    status={verificationStatus.email ? 'completed' : 'pending'}
                >
                    {verificationStatus.email ? (
                        <p style={{ margin: 0, color: '#2e7d32', fontWeight: '600' }}>✅ Email Verified</p>
                    ) : (
                        <button className="btn btn-secondary">Verify Email</button>
                    )}
                </VerificationStep>

                {/* Step 2: ID Upload */}
                <VerificationStep
                    icon="🆔"
                    title="Identity Verification"
                    description="Upload your Driver's License or Aadhaar card"
                    status={verificationStatus.idUpload ? 'completed' : uploadedId ? 'pending' : 'incomplete'}
                >
                    {verificationStatus.idUpload ? (
                        <p style={{ margin: 0, color: '#2e7d32', fontWeight: '600' }}>✅ ID Verified</p>
                    ) : uploadedId ? (
                        <div>
                            <p style={{ margin: 0, color: '#fbc02d', fontWeight: '600' }}>⏳ Under Review: {uploadedId}</p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>We'll review your ID within 24 hours</p>
                        </div>
                    ) : (
                        <div>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleIdUpload}
                                style={{ display: 'none' }}
                                id="id-upload"
                            />
                            <label htmlFor="id-upload" className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                                Upload ID Document
                            </label>
                        </div>
                    )}
                </VerificationStep>

                {/* Step 3: Transport Confirmation */}
                <VerificationStep
                    icon="🚴"
                    title="Transport Confirmation"
                    description="Confirm your mode of transportation for deliveries"
                    status={verificationStatus.transport ? 'completed' : 'incomplete'}
                >
                    {verificationStatus.transport ? (
                        <p style={{ margin: 0, color: '#2e7d32', fontWeight: '600' }}>✅ Transport Confirmed</p>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <select
                                value={transportType}
                                onChange={(e) => setTransportType(e.target.value)}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            >
                                <option value="">Select Transport Type</option>
                                <option value="bicycle">🚴 Bicycle</option>
                                <option value="motorcycle">🏍️ Motorcycle</option>
                                <option value="car">🚗 Car</option>
                                <option value="walking">🚶 Walking</option>
                            </select>
                            <button
                                onClick={handleTransportSubmit}
                                className="btn btn-secondary"
                                disabled={!transportType}
                            >
                                Confirm
                            </button>
                        </div>
                    )}
                </VerificationStep>
            </div>

            {/* Overall Status */}
            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Verification Progress</h4>
                <div style={{ width: '100%', height: '12px', backgroundColor: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${(Object.values(verificationStatus).filter(v => v).length / 3) * 100}%`,
                        height: '100%',
                        backgroundColor: 'var(--secondary-color)',
                        transition: 'width 0.3s'
                    }}></div>
                </div>
                <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {Object.values(verificationStatus).filter(v => v).length} of 3 steps completed
                </p>
            </div>
        </div>
    );
};

const VerificationStep = ({ icon, title, description, status, children }) => {
    const statusColors = {
        completed: '#e8f5e9',
        pending: '#fff8e1',
        incomplete: '#fafafa'
    };

    return (
        <div style={{
            backgroundColor: statusColors[status] || 'white',
            padding: '1.5rem',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            borderLeft: `4px solid ${status === 'completed' ? '#2e7d32' : status === 'pending' ? '#fbc02d' : '#ccc'}`
        }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{icon}</span>
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{title}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
};

export default VolunteerVerification;
