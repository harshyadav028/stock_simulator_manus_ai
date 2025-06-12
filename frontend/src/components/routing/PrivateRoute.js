import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // If authenticated, render the child routes
  // If not, redirect to login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
