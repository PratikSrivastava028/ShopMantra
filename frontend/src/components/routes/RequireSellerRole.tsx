import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const RequireSellerRole: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== 'seller') {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};
export default RequireSellerRole;
