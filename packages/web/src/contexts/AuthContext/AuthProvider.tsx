'use client';

import type { User, UserInfo } from '@hbcore/types';
import { signOut as firebaseSignOut, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { type ReactNode, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { auth, googleAuthProvider } from '@/lib/firebase/auth';
import { AuthContext, type AuthContextType } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<(User & UserInfo) | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up token getter for API client
  useEffect(() => {
    const getIdToken = async (): Promise<string | null> => {
      if (!auth.currentUser) {
        return null;
      }
      return auth.currentUser.getIdToken();
    };

    apiClient.setTokenGetter(getIdToken);
  }, []);

  useEffect(() => {
    const PROFILE_CACHE_KEY = 'hbcore-profile-cache';

    const saveProfileToCache = (user: User & UserInfo) => {
      if (typeof window === 'undefined') {
        return;
      }

      try {
        const cache = {
          firstname: user.firstname ?? null,
          lastname: user.lastname ?? null,
          photoUrl: user.photoUrl ?? null,
        };
        localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cache));
      } catch (error) {
        console.error('Failed to cache profile:', error);
      }
    };

    const clearProfileCache = () => {
      if (typeof window === 'undefined') {
        return;
      }

      try {
        localStorage.removeItem(PROFILE_CACHE_KEY);
      } catch (error) {
        console.error('Failed to clear cached profile:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get Firebase ID token
          const idToken = await firebaseUser.getIdToken();

          // Authenticate with our API
          const response = await apiClient.post<{ user: User & UserInfo }>('/auth/firebase', {
            idToken,
          });

          setUser(response.data.user);
          saveProfileToCache(response.data.user);
        } catch (error) {
          console.error('Failed to authenticate with API:', error);
          setUser(null);
          clearProfileCache();
        }
      } else {
        setUser(null);
        clearProfileCache();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();

      // Authenticate with our API
      const response = await apiClient.post<{ user: User & UserInfo }>('/auth/firebase', {
        idToken,
      });

      setUser(response.data.user);

      // Cache profile data
      if (typeof window !== 'undefined') {
        try {
          const PROFILE_CACHE_KEY = 'hbcore-profile-cache';
          const cache = {
            firstname: response.data.user.firstname ?? null,
            lastname: response.data.user.lastname ?? null,
            photoUrl: response.data.user.photoUrl ?? null,
          };
          localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cache));
        } catch (error) {
          console.error('Failed to cache profile:', error);
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);

      // Clear profile cache
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('hbcore-profile-cache');
        } catch (error) {
          console.error('Failed to clear cached profile:', error);
        }
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!auth.currentUser) {
      return null;
    }
    return auth.currentUser.getIdToken();
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
