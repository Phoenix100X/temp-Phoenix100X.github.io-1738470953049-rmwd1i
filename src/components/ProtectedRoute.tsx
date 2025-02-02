import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { AlertCircle } from 'lucide-react';

interface Props {
  allowedRoles?: ('admin' | 'staff' | 'parent')[];
  requireSuperUser?: boolean;
}

export function ProtectedRoute({ allowedRoles, requireSuperUser = false }: Props) {
  const { user, profile, isLoading, error } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-xl font-semibold text-red-900 mb-2">Authentication Error</h2>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireSuperUser && !isSuperUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}