import React from 'react';
import { Navigate } from 'react-router-dom';
import { isJwtExpired } from '../utils/tokenUtils';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

  if (!token || isJwtExpired(token)) {
    return <Navigate to="/auth-callback" />;
  }

  return children;
};

export default ProtectedRoute;