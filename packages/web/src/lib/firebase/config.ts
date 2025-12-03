/**
 * Firebase client configuration
 * These values should be set in environment variables
 */
function getFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (!apiKey) {
    throw new Error(
      'NEXT_PUBLIC_FIREBASE_API_KEY is required. Please set it in your .env file. ' +
        'You can find it in Firebase Console > Project Settings > General > Your apps > Web app config',
    );
  }

  if (!projectId) {
    throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is required. Please set it in your .env file.');
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

export const firebaseConfig = getFirebaseConfig();
