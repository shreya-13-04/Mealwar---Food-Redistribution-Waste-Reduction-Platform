import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Listings from './pages/Listings';
import CreateListing from './pages/CreateListing';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { ListingsProvider } from './context/ListingsContext';

function AppContent() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo-wrapper">
            <Link to="/listings" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1 className="logo">MealWar</h1>
            </Link>
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
          <Link
            to="/listings"
            className={`nav-btn ${currentPath === '/listings' || currentPath === '/' ? 'active' : ''}`}
          >
            View Listings
          </Link>
          <Link
            to="/create"
            className={`nav-btn ${currentPath === '/create' ? 'active' : ''}`}
          >
            Create Listing
          </Link>
          <Link
            to="/dashboard"
            className={`nav-btn ${currentPath === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/register"
            className={`nav-btn ${currentPath === '/register' ? 'active' : ''}`}
          >
            Join Us
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Listings />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/create" element={<CreateListing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
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

function App() {
  return (
    <Router>
      <ListingsProvider>
        <AppContent />
      </ListingsProvider>
    </Router>
  );
}

export default App;
