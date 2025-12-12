import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirebaseConfig } from './config';

/**
 * Check if we're running in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get or initialize Firebase app instance
 * Uses singleton pattern to ensure only one app instance exists
 * Only initializes in browser environment
 */
function getFirebaseApp(): FirebaseApp | null {
  if (!isBrowser()) {
    return null;
  }
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }
  return initializeApp(getFirebaseConfig());
}

let authInstance: Auth | null = null;

/**
 * Get Firebase Auth instance
 * Lazily initializes auth on first access
 * Only works in browser environment
 */
function getFirebaseAuth(): Auth | null {
  if (!isBrowser()) {
    return null;
  }
  if (!authInstance) {
    const app = getFirebaseApp();
    if (!app) {
      return null;
    }
    authInstance = getAuth(app);
  }
  return authInstance;
}

// Export singleton instances
// Using a getter to ensure lazy initialization
// Only accessible in browser environment
export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    // Only initialize Firebase in browser environment
    if (!isBrowser()) {
      // Return safe defaults for server-side rendering
      // This prevents errors during SSR
      if (prop === 'currentUser') {
        return null;
      }
      if (typeof prop === 'string') {
        // Return no-op functions for methods
        return () => {
          // Silent no-op on server side
        };
      }
      return undefined;
    }

    const authInstance = getFirebaseAuth();
    if (!authInstance) {
      // Fallback if initialization fails (shouldn't happen in browser)
      return undefined;
    }
    return authInstance[prop as keyof Auth];
  },
}) as Auth;

// Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider();
// Add scopes for better compatibility
googleAuthProvider.addScope('profile');
googleAuthProvider.addScope('email');
// Set custom parameters to ensure proper OAuth flow
googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
});
