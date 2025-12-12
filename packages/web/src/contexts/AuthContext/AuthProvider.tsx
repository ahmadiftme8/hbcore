'use client';

import type { User, UserInfo } from '@hbcore/types';
import { onAuthStateChanged } from 'firebase/auth';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/auth';
import { apiClient } from '@/repositories/api-client';
import { authService } from '@/services/auth.service';
import { AuthContext, type AuthContextType } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<(User & UserInfo) | null>(null);
  const [loading, setLoading] = useState(true);

  const getIdToken = useCallback(async (): Promise<string | null> => {
    return authService.getIdToken();
  }, []);

  useEffect(() => {
    apiClient.setTokenGetter(getIdToken);
  }, [getIdToken]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const authenticatedUser = await authService.authenticateWithFirebase(idToken);
          setUser(authenticatedUser);
        } catch (error) {
          setUser(null);
          authService.clearProfileCache();
        }
      } else {
        setUser(null);
        authService.clearProfileCache();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const authenticatedUser = await authService.signInWithGoogle();
    setUser(authenticatedUser);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const signInWithPhone = async (phone: string, otp: string) => {
    const authenticatedUser = await authService.signInWithPhone(phone, otp);
    setUser(authenticatedUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithPhone,
    signOut,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
