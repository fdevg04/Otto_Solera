// client/src/components/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom'; // Cambia Redirect por Navigate

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" />  // Cambiado Redirect por Navigate
  );
};

export default PrivateRoute;
