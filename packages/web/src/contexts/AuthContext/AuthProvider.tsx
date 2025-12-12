'use client';

import type { User, UserInfo } from '@hbcore/types';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
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
    // Google/Firebase authentication is disabled
    // Only phone authentication is available
    setLoading(false);
  }, []);

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
    signInWithPhone,
    signOut,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
