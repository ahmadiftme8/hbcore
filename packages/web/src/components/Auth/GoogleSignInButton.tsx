'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { Button } from '@/components/ui/button';

export function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSignIn} disabled={loading}>
      {loading ? 'Signing in...' : 'Sign in with Google'}
    </Button>
  );
}
