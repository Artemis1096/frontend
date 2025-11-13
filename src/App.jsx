// In frontend/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuctionDetailPage from './pages/AuctionDetailPage'; // <-- Import

import CreateAuctionPage from './pages/CreateAuctionPage';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
// We'll add these pages later
// import AuctionDetailPage from './pages/AuctionDetailPage';
// import CreateAuctionPage from './pages/CreateAuctionPage';
// import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      {/* All routes use the Navbar Layout */}
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="auction/:id" element={<AuctionDetailPage />} />
        
        {/* --- Protected User Routes --- */}
        <Route element={<PrivateRoute />}>
          <Route path="auctions/new" element={<CreateAuctionPage />} />
          {/* You could add a "My Bids" or "My Items" page here later */}
        </Route>

        {/* --- Protected Admin Routes --- */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;