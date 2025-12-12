'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { GoogleSignInButton } from '@/components/Auth/GoogleSignInButton';
import { PhoneSignInButton } from '@/components/Auth/PhoneSignInButton';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useTranslation } from '@/i18n/useTranslation';
import './auth.css';

function AuthLoadingState() {
  const { t } = useTranslation();
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div>{t.auth.signingIn}</div>
      </div>
    </div>
  );
}

function AuthPageContent() {
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
    return <AuthLoadingState />;
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
          <div className="auth-page__divider">
            <span>{t.auth.or}</span>
          </div>
          <PhoneSignInButton />
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthLoadingState />}>
      <AuthPageContent />
    </Suspense>
  );
}
