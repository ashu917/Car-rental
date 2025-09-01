import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from './Context/AppContext';

const ProtectedRoute = ({ redirectTo = '/' }) => {
  const { token, authReady } = useAppContext();
  const location = useLocation();

  // Wait until auth status is resolved
  if (!authReady) return null;

  // If not authenticated, redirect
  if (!token) return <Navigate to={redirectTo} state={{ from: location }} replace />;

  // When authenticated, allow nested routes/components
  return <Outlet />;
};

export default ProtectedRoute;


