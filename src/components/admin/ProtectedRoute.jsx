import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-electric-400/30 border-t-electric-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;
  return children;
};

export default ProtectedRoute;
