/**
 * Check if we're running in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Firebase client configuration
 * These values should be set in environment variables
 *
 * This function is lazy-loaded to avoid evaluation during build time
 * when environment variables may not be available.
 * Only works in browser environment to prevent SSR errors.
 */
export function getFirebaseConfig() {
  // Only initialize Firebase in browser environment
  if (!isBrowser()) {
    throw new Error(
      'Firebase config can only be accessed in browser environment. ' +
        'This error should not occur if Firebase is properly initialized client-side only.',
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim();
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim();
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim();
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim();

  if (!apiKey || apiKey.length === 0) {
    throw new Error(
      'NEXT_PUBLIC_FIREBASE_API_KEY is required but missing or empty. ' +
        'Please ensure it is set in your environment variables during build time. ' +
        'You can find it in Firebase Console > Project Settings > General > Your apps > Web app config',
    );
  }

  if (!projectId || projectId.length === 0) {
    throw new Error(
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID is required but missing or empty. ' +
        'Please ensure it is set in your environment variables during build time.',
    );
  }

  // Auto-generate auth domain if not provided
  const finalAuthDomain = authDomain || `${projectId}.firebaseapp.com`;
  // Auto-generate storage bucket if not provided
  const finalStorageBucket = storageBucket || `${projectId}.appspot.com`;

  // Build config object with required fields
  const config: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
  } = {
    apiKey,
    authDomain: finalAuthDomain,
    projectId,
  };

  // Add optional fields if provided
  if (finalStorageBucket) {
    config.storageBucket = finalStorageBucket;
  }
  if (messagingSenderId) {
    config.messagingSenderId = messagingSenderId;
  }
  if (appId) {
    config.appId = appId;
  }
  if (measurementId) {
    config.measurementId = measurementId;
  }

  return config;
}
