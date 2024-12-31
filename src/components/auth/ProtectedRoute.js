/**
 * Protected Route Component
 * 
 * Purpose: Protect routes that require authentication
 * Features:
 * - Route protection
 * - Redirect to login
 * - Role-based access
 * 
 * @module ProtectedRoute
 * @category Components/Auth
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, isAuthenticated, requiredRole }) => {
  const location = useLocation();
  const user = useSelector(state => state.user.currentUser);

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the route requires a specific role
  if (requiredRole && user?.role !== requiredRole) {
    // User doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
