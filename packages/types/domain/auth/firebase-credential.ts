import type { FirebaseUid } from '../../src/domain-ids';
import type { AuthCredential } from './credential';
import { AuthProvider } from './provider';

/**
 * Firebase-specific authentication credential
 */
export interface FirebaseAuthCredential extends AuthCredential {
  provider: AuthProvider.FIREBASE;
  /** Firebase UID (unique identifier from Firebase) */
  firebaseUid: FirebaseUid;
}
