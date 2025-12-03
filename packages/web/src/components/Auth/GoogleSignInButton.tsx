'use client';

import { FirebaseError } from 'firebase/app';
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

      // Handle Firebase errors with proper error codes
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/unauthorized-domain':
            alert(
              'Firebase configuration error: Unauthorized domain.\n\n' +
                'Please ensure:\n' +
                '1. localhost:3000 is added to authorized domains in Firebase Console\n' +
                '   (Authentication > Settings > Authorized domains)\n' +
                '2. If using a different port, add that domain as well',
            );
            break;
          case 'auth/operation-not-allowed':
            alert(
              'Firebase configuration error: Sign-in method not enabled.\n\n' +
                'Please ensure:\n' +
                '1. Google Sign-In is enabled in Firebase Console\n' +
                '   (Authentication > Sign-in method > Google > Enable)',
            );
            break;
          case 'auth/popup-closed-by-user':
            // User closed the popup, no need to show error
            return;
          case 'auth/popup-blocked':
            alert('Popup blocked by browser.\n\n' + 'Please allow popups for this site and try again.');
            break;
          case 'auth/network-request-failed':
            alert('Network error. Please check your internet connection and try again.');
            break;
          case 'auth/configuration-not-found':
            alert(
              'Firebase configuration error: Configuration not found.\n\n' +
                'This usually happens when:\n' +
                '1. Firebase environment variables are missing or empty in production\n' +
                '2. Your production domain is not authorized in Firebase Console\n\n' +
                'Please check:\n' +
                '1. All NEXT_PUBLIC_FIREBASE_* variables are set during Docker build\n' +
                '2. Your production domain (e.g., hambazievent.com) is added to authorized domains\n' +
                '   (Firebase Console > Authentication > Settings > Authorized domains)\n' +
                '3. Google Sign-In is enabled in Firebase Console\n' +
                '4. Firebase project configuration matches your environment',
            );
            break;
          default:
            alert(
              `Sign in failed: ${error.message}\n\n` +
                `Error code: ${error.code}\n\n` +
                'Please check:\n' +
                '1. Google Sign-In is enabled in Firebase Console\n' +
                '2. Your domain is added to authorized domains in Firebase Console\n' +
                '   (Authentication > Settings > Authorized domains)\n' +
                '3. Firebase project configuration is correct',
            );
        }
      } else if (error instanceof Error) {
        alert(`Sign in failed: ${error.message}`);
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
