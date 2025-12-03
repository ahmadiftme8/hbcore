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
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('auth/configuration-not-found')) {
          alert(
            'Firebase configuration error. Please ensure:\n' +
            '1. Google Sign-In is enabled in Firebase Console\n' +
            '2. localhost:3000 is added to authorized domains in Firebase Console\n' +
            '3. Firebase project configuration is correct'
          );
        } else if (error.message.includes('auth/popup-closed-by-user')) {
          // User closed the popup, no need to show error
          return;
        } else {
          alert(`Sign in failed: ${error.message}`);
        }
      } else {
        alert('Sign in failed. Please try again.');
      }
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
