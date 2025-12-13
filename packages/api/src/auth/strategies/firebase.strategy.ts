import {
  type AuthResult,
  type Email,
  EmailSchema,
  FirebaseUidSchema,
  type ProviderUid,
  ProviderUidSchema,
} from '@hbcore/types';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '@/firebase/firebase.service';
import { UsersService } from '@/users/users.service';
import type { AuthStrategy } from './auth-strategy.interface';

@Injectable()
export class FirebaseStrategy implements AuthStrategy {
  private readonly logger = new Logger(FirebaseStrategy.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Authenticate using Firebase ID token
   * @param idToken - Firebase ID token from the client
   * @returns Authentication result with user and Firebase UID
   */
  async authenticate(idToken: string): Promise<AuthResult> {
    try {
      // Verify the Firebase ID token
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);

      // Extract user information from the decoded token and parse with Zod schemas
      let firebaseUid: string;
      try {
        firebaseUid = FirebaseUidSchema.parse(decodedToken.uid);
      } catch (validationError) {
        this.logger.warn('Invalid Firebase UID format in token', {
          uid: decodedToken.uid,
          error: validationError,
        });
        throw new UnauthorizedException('Invalid token: Firebase UID format is invalid');
      }

      let email: Email | null = null;
      if (decodedToken.email) {
        try {
          email = EmailSchema.parse(decodedToken.email);
        } catch (validationError) {
          this.logger.warn('Invalid email format in token', {
            email: decodedToken.email,
            error: validationError,
          });
          // Don't throw, just log - email is optional
        }
      }

      const name = decodedToken.name || null;

      // Extract firstname and lastname
      // Check if given_name and family_name are available in custom claims or token
      // These fields may be present in Google Sign-In tokens but are not part of the standard DecodedIdToken type
      const tokenWithClaims = decodedToken as typeof decodedToken & {
        given_name?: string;
        family_name?: string;
      };
      const givenName = tokenWithClaims.given_name || null;
      const familyName = tokenWithClaims.family_name || null;

      let firstname: string | null = null;
      let lastname: string | null = null;

      if (givenName && familyName) {
        // Use provided names if available
        firstname = givenName;
        lastname = familyName;
      } else if (name) {
        // Parse name field: first string is firstname, last string is lastname
        const nameParts = name
          .trim()
          .split(/\s+/)
          .filter((part) => part.length > 0);
        if (nameParts.length > 0) {
          firstname = nameParts[0];
          if (nameParts.length > 1) {
            lastname = nameParts[nameParts.length - 1];
          }
        }
      }

      // Find or create user by Firebase UID
      const user = await this.usersService.findOrCreateByFirebaseUid(firebaseUid, {
        email,
        name,
        firstname,
        lastname,
      });

      // Validate provider UID
      let providerUid: ProviderUid;
      try {
        providerUid = ProviderUidSchema.parse(firebaseUid);
      } catch (validationError) {
        this.logger.error('Failed to parse provider UID', {
          firebaseUid,
          error: validationError,
        });
        throw new UnauthorizedException('Invalid token: provider UID is invalid');
      }

      return {
        user,
        providerUid,
      };
    } catch (error) {
      // Re-throw UnauthorizedException as-is
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Log unexpected errors for debugging
      this.logger.error('Unexpected error during Firebase authentication', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw new UnauthorizedException('Authentication failed');
    }
  }
}
