'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { GoogleSignInButton } from '@/components/Auth/GoogleSignInButton';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useTranslation } from '@/i18n/useTranslation';
import './auth.css';

export default function AuthPage() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push(returnUrl);
    }
  }, [user, loading, router, returnUrl]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-page__container">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render auth form if already authenticated (redirect will happen)
  if (user) {
    return null;
  }

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h1 className="auth-page__title">{t.auth.signIn}</h1>
        <p className="auth-page__description">{t.auth.signInDescription}</p>
        <div className="auth-page__actions">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
