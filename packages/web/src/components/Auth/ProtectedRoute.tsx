'use client';

import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to auth page with current path as return URL
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/auth?returnUrl=${returnUrl}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <div className="protected-route__loading">Loading...</div>;
  }

  if (!user) {
    return fallback || <div className="protected-route__unauthorized">Please sign in to access this page.</div>;
  }

  return <>{children}</>;
}
