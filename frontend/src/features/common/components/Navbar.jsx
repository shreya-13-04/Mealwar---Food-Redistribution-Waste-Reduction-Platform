import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getDashboardRoute } from '../../auth/authUtils';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const dashboardPath = user ? getDashboardRoute(user.role) : '/dashboard';

    return (
        <nav className="site-header">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
                <div className="logo-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link to="/listings" style={{ textDecoration: 'none', color: 'var(--primary-color)' }}>
                        <h1 className="logo" style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>MealWar</h1>
                    </Link>
                    <svg
                        className="leaf-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: '24px', height: '24px' }}
                    >
                        <path
                            d="M12 2C12 2 12 6 10 10C8 14 4 15 4 15C4 15 8 16 10 20C12 24 12 22 12 22C12 22 12 24 14 20C16 16 20 15 20 15C20 15 16 14 14 10C12 6 12 2 12 2Z"
                            fill="var(--secondary-color)"
                            fillOpacity="0.8"
                        />
                    </svg>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/listings" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>Find Food</Link>

                    {user ? (
                        <>
                            <Link to={dashboardPath} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>Dashboard</Link>
                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate(dashboardPath)}>Profile</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
