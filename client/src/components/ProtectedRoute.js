// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, authToken }) => {
  return authToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
