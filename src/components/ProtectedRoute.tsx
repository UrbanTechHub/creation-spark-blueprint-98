
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Simple check - in a real app this would check authentication state
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
