import type { AuthResult } from '@hbcore/types';
import { Injectable } from '@nestjs/common';
import { FirebaseService } from '@/firebase/firebase.service';
import { UsersService } from '@/users/users.service';
import type { AuthStrategy } from './auth-strategy.interface';

@Injectable()
export class FirebaseStrategy implements AuthStrategy {
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
    // Verify the Firebase ID token
    const decodedToken = await this.firebaseService.verifyIdToken(idToken);

    // Extract user information from the decoded token
    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email || null;
    const name = decodedToken.name || null;
    const photoUrl = decodedToken.picture || null;

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
      photoUrl,
    });

    return {
      user,
      providerUid: firebaseUid,
    };
  }
}
