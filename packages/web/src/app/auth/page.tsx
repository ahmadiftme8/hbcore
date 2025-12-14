'use client';

import { FeatureFlag } from '@hbcore/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useContext, useEffect, useState } from 'react';
import { PhoneSignInButton } from '@/components/Auth/PhoneSignInButton';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { FeatureFlagContext } from '@/contexts/FeatureFlagContext/FeatureFlagContext';
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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const featureFlagContext = useContext(FeatureFlagContext);
  const [isAuthEnabled, setIsAuthEnabled] = useState<boolean | null>(null);

  // Fetch auth feature flag status
  useEffect(() => {
    if (!featureFlagContext) {
      // If context is not available, default to disabled for security
      setIsAuthEnabled(false);
      return;
    }

    // Fetch the flag status
    void featureFlagContext.fetchFlag(FeatureFlag.AUTH).then(setIsAuthEnabled);
  }, [featureFlagContext]);

  // Redirect if auth feature is disabled
  useEffect(() => {
    if (isAuthEnabled === false) {
      router.replace('/');
    }
  }, [isAuthEnabled, router]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user && isAuthEnabled) {
      router.push(returnUrl);
    }
  }, [user, authLoading, router, returnUrl, isAuthEnabled]);

  // Show loading state while checking auth or feature flag
  if (authLoading || isAuthEnabled === null) {
    return (
      <div className="auth-page">
        <div className="auth-page__container">
          <div>{t.auth.signingIn}</div>
        </div>
      </div>
    );
  }

  // Don't render auth form if feature is disabled (redirect will happen)
  if (!isAuthEnabled) {
    return null;
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
