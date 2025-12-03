import { Injectable, OnModuleInit } from '@nestjs/common';
import admin from 'firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { ConfigService } from '@/config/config.service';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const config = this.configService.e;

    // Initialize Firebase Admin SDK if not already initialized
    try {
      // Try to get the default app first
      this.app = admin.app();
    } catch {
      // If no app exists, initialize a new one
      // Replace escaped newlines in private key
      const privateKey = config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.FIREBASE_PROJECT_ID,
          clientEmail: config.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
    }
  }

  /**
   * Verify a Firebase ID token and return the decoded token
   * @param idToken - The Firebase ID token to verify
   * @returns Decoded token with user information
   * @throws Error if token is invalid
   */
  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    if (!this.app) {
      throw new Error('Firebase Admin SDK not initialized');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error(`Invalid Firebase ID token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the Firebase Auth instance
   */
  getAuth(): admin.auth.Auth {
    if (!this.app) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    return admin.auth();
  }
}
