import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero" style={{ background: 'linear-gradient(135deg, var(--bg-light) 0%, #ffffff 100%)' }}>
                <div className="container">
                    <h1 style={{ color: 'var(--primary-color)' }}>Redistributing Surplus Food, Reducing Waste</h1>
                    <p style={{ color: 'var(--text-main)' }}>Join our community-driven platform to bridge the gap between food waste and food insecurity. Every meal saved is a step towards a sustainable future.</p>
                    <div className="hero-btns">
                        <Link to="/register?role=seller" className="btn btn-primary">Register as Seller</Link>
                        <Link to="/register?role=buyer" className="btn btn-secondary">Find Food</Link>
                        <Link to="/register?role=volunteer" className="btn btn-primary">Become a Volunteer</Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Sellers</h3>
                            <p>Restaurants, hotels, and events list their surplus food with detailed safety info.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Volunteers</h3>
                            <p>Verified locals pick up food and ensure safe delivery to those in need.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Buyers/NGOs</h3>
                            <p>Browse available listings and receive fresh food for their communities.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Trust Us */}
            <section className="section" style={{ backgroundColor: 'var(--white)' }}>
                <div className="container">
                    <h2 className="section-title">Why Trust Us</h2>
                    <div className="features-grid">
                        <div className="feature-card" style={{ boxShadow: 'none', border: '1px solid var(--accent-color)', backgroundColor: 'var(--bg-light)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛡️</div>
                            <h3>Food Safety</h3>
                            <p>Strict FSSAI certification checks and hygiene declarations for all sellers.</p>
                        </div>
                        <div className="feature-card" style={{ boxShadow: 'none', border: '1px solid var(--accent-color)', backgroundColor: 'var(--bg-light)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤝</div>
                            <h3>Verified Volunteers</h3>
                            <p>Every volunteer undergoes background checks and training for food handling.</p>
                        </div>
                        <div className="feature-card" style={{ boxShadow: 'none', border: '1px solid var(--accent-color)', backgroundColor: 'var(--bg-light)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⭐</div>
                            <h3>Ratings System</h3>
                            <p>Transparent feedback loop ensures high standards and accountability.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="section" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 className="section-title" style={{ color: 'white' }}>Our Impact</h2>
                    <div className="features-grid">
                        <div>
                            <h2 style={{ fontSize: '3rem', margin: '0' }}>5,000+</h2>
                            <p>Meals Saved</p>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '3rem', margin: '0' }}>1.2 Tons</h2>
                            <p>Waste Reduced</p>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '3rem', margin: '0' }}>150+</h2>
                            <p>Verified Partners</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-logo">
                            <h2>MealWar</h2>
                            <p>Feeding communities, one meal at a time.</p>
                        </div>
                        <div className="footer-links">
                            <h4>Platform</h4>
                            <ul>
                                <li><Link to="/listings">Find Food</Link></li>
                                <li><Link to="/register">Join Us</Link></li>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4>Info</h4>
                            <ul>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                                <li><Link to="/terms">Terms & Privacy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 MealWar - Food Redistribution Platform. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
