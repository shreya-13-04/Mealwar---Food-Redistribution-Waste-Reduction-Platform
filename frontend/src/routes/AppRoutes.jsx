import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Listings from '../pages/Listings';

export default function AppRoutes() {
  return (
    <Router>
      <header className="site-header">
        <nav className="nav">
          <Link to="/" className="nav-brand">
            Mealwar
          </Link>
          <div className="nav-links">
            <Link to="/listings">Listings</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/register">Register</Link>
            <Link to="/">Login</Link>
          </div>
        </nav>
      </header>

      <main className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/listings" element={<Listings />} />
        </Routes>
      </main>
    </Router>
  );
}
