import { STORAGE_KEYS } from '../lib/constants/storage-keys';
import { logger } from '../lib/utils/logger';

/**
 * Storage Service
 * Centralized localStorage operations with error handling
 */
export class StorageService {
  /**
   * Check if running in browser environment
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Get item from localStorage
   */
  getItem(key: string): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    try {
      return localStorage.getItem(key);
    } catch (error) {
      logger.error(`Failed to get item from localStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  setItem(key: string, value: string): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      logger.error(`Failed to set item in localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error(`Failed to remove item from localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      logger.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * Get phone authentication token
   */
  getPhoneToken(): string | null {
    return this.getItem(STORAGE_KEYS.PHONE_TOKEN);
  }

  /**
   * Set phone authentication token
   */
  setPhoneToken(token: string): boolean {
    return this.setItem(STORAGE_KEYS.PHONE_TOKEN, token);
  }

  /**
   * Remove phone authentication token
   */
  removePhoneToken(): boolean {
    return this.removeItem(STORAGE_KEYS.PHONE_TOKEN);
  }

  /**
   * Get cached profile
   */
  getCachedProfile<T>(): T | null {
    const cached = this.getItem(STORAGE_KEYS.PROFILE_CACHE);
    if (!cached) {
      return null;
    }

    try {
      return JSON.parse(cached) as T;
    } catch (error) {
      logger.error('Failed to parse cached profile:', error);
      return null;
    }
  }

  /**
   * Set cached profile
   */
  setCachedProfile<T>(profile: T): boolean {
    try {
      const serialized = JSON.stringify(profile);
      return this.setItem(STORAGE_KEYS.PROFILE_CACHE, serialized);
    } catch (error) {
      logger.error('Failed to cache profile:', error);
      return false;
    }
  }

  /**
   * Remove cached profile
   */
  removeCachedProfile(): boolean {
    return this.removeItem(STORAGE_KEYS.PROFILE_CACHE);
  }
}

export const storageService = new StorageService();

