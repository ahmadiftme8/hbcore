import type { UserId } from '../../src/domain-ids';
import { AuthProvider } from './provider';

/**
 * Base interface for authentication credentials
 */
export interface AuthCredential {
  /** User ID this credential belongs to */
  userId: UserId;
  /** Authentication provider */
  provider: AuthProvider;
}
