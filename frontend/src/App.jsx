import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import './App.css';
import './index.css';

// Contexts
import { ListingsProvider } from './context/ListingsContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import LandingPage from './features/common/pages/LandingPage';
import RegisterSelection from './features/auth/pages/RegisterSelection';
import SellerRegister from './features/auth/pages/SellerRegister';
import BuyerRegister from './features/auth/pages/BuyerRegister';
import VolunteerRegister from './features/auth/pages/VolunteerRegister';
import LoginPage from './features/auth/pages/LoginPage';

// Feature Components
import SellerDashboardLayout from './features/seller/components/SellerDashboardLayout';
import SellerOverview from './features/seller/pages/SellerOverview';
import SellerListings from './features/seller/pages/SellerListings';
import CreateListing from './features/seller/pages/CreateListing';
import SellerOrders from './features/seller/pages/SellerOrders';
import SellerPayments from './features/seller/pages/SellerPayments';
import SellerRatings from './features/seller/pages/SellerRatings';
import SellerProfile from './features/seller/pages/SellerProfile';
import SellerNotifications from './features/seller/pages/SellerNotifications';
import BuyerDashboardLayout from './features/buyer/components/BuyerDashboardLayout';
import BuyerHome from './features/buyer/pages/BuyerHome';
import BuyerSearch from './features/buyer/pages/BuyerSearch';
import BuyerFoodDetail from './features/buyer/pages/BuyerFoodDetail';
import BuyerCheckout from './features/buyer/pages/BuyerCheckout';
import BuyerOrders from './features/buyer/pages/BuyerOrders';
import BuyerOrderDetails from './features/buyer/pages/BuyerOrderDetails';
import BuyerOrderTrack from './features/buyer/pages/BuyerOrderTrack';
import BuyerOrderRate from './features/buyer/pages/BuyerOrderRate';
import BuyerFavourites from './features/buyer/pages/BuyerFavourites';
import BuyerProfile from './features/buyer/pages/BuyerProfile';
import VolunteerDashboardLayout from './features/volunteer/components/VolunteerDashboardLayout';
import VolunteerHome from './features/volunteer/pages/VolunteerHome';
import VolunteerVerification from './features/volunteer/pages/VolunteerVerification';
import VolunteerOrders from './features/volunteer/pages/VolunteerOrders';
import VolunteerOrderDetail from './features/volunteer/pages/VolunteerOrderDetail';
import VolunteerRatings from './features/volunteer/pages/VolunteerRatings';
import VolunteerProfile from './features/volunteer/pages/VolunteerProfile';
import BuyerNotifications from './features/buyer/pages/BuyerNotifications';
import VolunteerNotifications from './features/volunteer/pages/VolunteerNotifications';
import VolunteerDashboard from './features/volunteer/pages/VolunteerDashboard';

import Listings from './pages/Listings';
import Dashboard from './pages/Dashboard';

// Components
import Navbar from './features/common/components/Navbar';

function AppContent() {
  const location = window.location;
  const isDashboardRoute = location.pathname.includes('/dashboard');

  return (
    <div className="app">
      {!isDashboardRoute && <Navbar />}
      <main>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication & Registration */}
          <Route path="/register" element={<RegisterSelection />} />
          <Route path="/register/seller" element={<SellerRegister />} />
          <Route path="/register/buyer" element={<BuyerRegister />} />
          <Route path="/register/volunteer" element={<VolunteerRegister />} />
          <Route path="/login" element={<LoginPage />} />

          {/* App Pages */}
          <Route path="/listings" element={<Listings />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Seller Dashboard */}
          <Route path="/seller/dashboard" element={<SellerDashboardLayout />}>
            <Route index element={<SellerOverview />} />
            <Route path="listings" element={<SellerListings />} />
            <Route path="listings/create" element={<CreateListing />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="payments" element={<SellerPayments />} />
            <Route path="ratings" element={<SellerRatings />} />
            <Route path="profile" element={<SellerProfile />} />
            <Route path="notifications" element={<SellerNotifications />} />
          </Route>

          {/* Buyer Dashboard */}
          <Route path="/buyer/dashboard" element={<BuyerDashboardLayout />}>
            <Route index element={<BuyerHome />} />
            <Route path="search" element={<BuyerSearch />} />
            <Route path="listing/:id" element={<BuyerFoodDetail />} />
            <Route path="checkout/:id" element={<BuyerCheckout />} />
            <Route path="orders" element={<BuyerOrders />} />
            <Route path="order/:id" element={<BuyerOrderDetails />} />
            <Route path="track/:id" element={<BuyerOrderTrack />} />
            <Route path="rate/:id" element={<BuyerOrderRate />} />
            <Route path="favourites" element={<BuyerFavourites />} />
            <Route path="profile" element={<BuyerProfile />} />
            <Route path="notifications" element={<BuyerNotifications />} />
          </Route>

          {/* Volunteer Dashboard */}
          <Route path="/volunteer/dashboard" element={<VolunteerDashboardLayout />}>
            <Route index element={<VolunteerHome />} />
            <Route path="orders" element={<VolunteerOrders />} />
            <Route path="order/:id" element={<VolunteerOrderDetail />} />
            <Route path="verification" element={<VolunteerVerification />} />
            <Route path="ratings" element={<VolunteerRatings />} />
            <Route path="profile" element={<VolunteerProfile />} />
            <Route path="notifications" element={<VolunteerNotifications />} />
          </Route>

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ListingsProvider>
          <AppContent />
        </ListingsProvider>
      </Router>
    </AuthProvider>
  );
}
