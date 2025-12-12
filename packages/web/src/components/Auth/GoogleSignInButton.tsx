'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useTranslation } from '@/i18n/useTranslation';
import { logger } from '@/lib/utils/logger';
import './GoogleSignInButton.css';

export function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleError } = useErrorHandler({
    defaultMessage: t.auth.errors.signInFailed,
    firebaseErrorMap: {
      'auth/unauthorized-domain': t.auth.errors.unauthorizedDomain,
      'auth/operation-not-allowed': t.auth.errors.operationNotAllowed,
      'auth/popup-blocked': t.auth.errors.popupBlocked,
      'auth/network-request-failed': t.auth.errors.networkError,
      'auth/configuration-not-found': t.auth.errors.configurationNotFound,
      'auth/internal-error': t.auth.errors.internalError,
    },
    onFirebasePopupClosed: () => {
      // User closed popup, don't show error
      setError(null);
    },
  });

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      const firebaseError = err as { code?: string };
      // Don't log popup-closed-by-user as an error - it's handled gracefully
      if (firebaseError.code !== 'auth/popup-closed-by-user') {
        logger.error('Sign in failed:', err);
      }
      const errorMessage = handleError(err);
      if (errorMessage) {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-signin">
      <Button onClick={handleSignIn} disabled={loading}>
        {loading ? t.auth.signingIn : t.auth.signInWithGoogle}
      </Button>
      {error && <p className="google-signin-error">{error}</p>}
    </div>
  );
}
