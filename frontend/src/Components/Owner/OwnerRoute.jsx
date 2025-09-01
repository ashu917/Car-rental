import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';

const OwnerRoute = () => {
  const { token, isOwner, authReady } = useAppContext();

  if (!authReady) return null;

  if (!token) return <Navigate to="/" replace />;

  if (!isOwner) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default OwnerRoute;


