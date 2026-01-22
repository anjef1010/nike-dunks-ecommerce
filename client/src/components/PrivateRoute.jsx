import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) 
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;

  if (!user) 
    return <Navigate to="/login" replace />;

  if (adminOnly && user.role !== 'admin') 
    return <Navigate to="/home" replace />;

  return children;
};

export default PrivateRoute;
