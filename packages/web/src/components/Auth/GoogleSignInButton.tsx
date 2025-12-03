'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useTranslation } from '@/i18n/useTranslation';

export function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // Redirect will be handled by auth page's useEffect when user state updates
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSignIn} disabled={loading}>
      {loading ? t.auth.signingIn : t.auth.signInWithGoogle}
    </Button>
  );
}
