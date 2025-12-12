import type { User, UserInfo } from '@hbcore/types';
import { signOut as firebaseSignOut, signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase/auth';
import { authRepository } from '../repositories/auth.repository';
import { storageService } from './storage.service';

/**
 * Auth Service
 * Handles authentication business logic
 */
export class AuthService {
  /**
   * Get authentication token (Firebase or phone token)
   */
  async getIdToken(): Promise<string | null> {
    // First try Firebase token
    if (auth.currentUser) {
      return auth.currentUser.getIdToken();
    }

    // Fallback to phone auth token from storage
    return storageService.getPhoneToken();
  }

  /**
   * Sign in with Google using Firebase
   */
  async signInWithGoogle(): Promise<User & UserInfo> {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const idToken = await result.user.getIdToken();

    const user = await authRepository.authenticateWithFirebase(idToken);
    this.saveProfileToCache(user);

    return user;
  }

  /**
   * Sign in with phone number and OTP
   */
  async signInWithPhone(phone: string, otp: string): Promise<User & UserInfo> {
    const response = await authRepository.verifyOtp(phone, otp);

    // Store phone token
    storageService.setPhoneToken(response.token);

    // Save profile to cache
    this.saveProfileToCache(response.user);

    return response.user;
  }

  /**
   * Request OTP for phone authentication
   */
  async requestOtp(phone: string, turnstileToken: string): Promise<string> {
    return authRepository.requestOtp(phone, turnstileToken);
  }

  /**
   * Sign out from all authentication methods
   */
  async signOut(): Promise<void> {
    // Sign out from Firebase if signed in
    if (auth.currentUser) {
      await firebaseSignOut(auth);
    }

    // Clear storage
    storageService.removePhoneToken();
    storageService.removeCachedProfile();
  }

  /**
   * Authenticate with Firebase ID token
   * Used when Firebase auth state changes
   */
  async authenticateWithFirebase(idToken: string): Promise<User & UserInfo> {
    const user = await authRepository.authenticateWithFirebase(idToken);
    this.saveProfileToCache(user);
    return user;
  }

  /**
   * Save user profile to cache
   */
  private saveProfileToCache(user: User & UserInfo): void {
    const cache = {
      firstname: user.firstname ?? null,
      lastname: user.lastname ?? null,
      photoUrl: user.photoUrl ?? null,
    };
    storageService.setCachedProfile(cache);
  }

  /**
   * Clear profile cache
   */
  clearProfileCache(): void {
    storageService.removeCachedProfile();
  }
}

export const authService = new AuthService();

