'use client';

import type { User, UserInfo } from '@hbcore/types';
import { createContext, useContext } from 'react';

/**
 * Authentication Context Type
 *
 * The `user` field is typed as `User & UserInfo` because:
 * - `User` is the minimal domain type containing only `{ id: number }`
 * - `UserInfo` contains profile data: `{ email, phone, name, photoUrl }`
 * - The intersection type `User & UserInfo` gives us the complete user object:
 *   `{ id: number, email?: string, phone?: string, name?: string, photoUrl?: string }`
 *
 * This design separates identity (User) from profile data (UserInfo), allowing
 * the User entity to remain minimal while still providing full user data to the frontend.
 */
export interface AuthContextType {
  user: (User & UserInfo) | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phone: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
