'use client';

import { type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="protected-route__loading">Loading...</div>;
  }

  if (!user) {
    return fallback || <div className="protected-route__unauthorized">Please sign in to access this page.</div>;
  }

  return <>{children}</>;
}
