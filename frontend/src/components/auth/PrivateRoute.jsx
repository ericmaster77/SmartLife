// frontend/src/components/auth/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  // Ajusta esta lógica a tu authService o a dónde guardes el token
  return !!localStorage.getItem('token');
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() 
    ? children 
    : <Navigate to="/login" replace />;
};

export default PrivateRoute;