import type { User, UserInfo } from '@hbcore/types';
import { authRepository } from '@/repositories/auth.repository';
import { storageService } from './storage.service';

/**
 * Auth Service
 * Handles authentication business logic
 */
export class AuthService {
  /**
   * Get authentication token (phone token only)
   */
  async getIdToken(): Promise<string | null> {
    // Only return phone auth token (Google/Firebase authentication is disabled)
    return storageService.getPhoneToken();
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
    // Clear storage (Google/Firebase authentication is disabled)
    storageService.removePhoneToken();
    storageService.removeCachedProfile();
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
