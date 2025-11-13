// In frontend/src/components/AdminRoute.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { user } = useAuth();
  // If user exists AND is an admin, show child route
  // Otherwise, redirect to homepage (or login)
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;