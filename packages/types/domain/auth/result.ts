import type { ProviderUid } from '../../src/domain-ids';
import type { User, UserInfo } from '../user';

/**
 * Result of an authentication attempt
 */
export interface AuthResult {
  /** The authenticated user */
  user: User & UserInfo;
  /** Provider-specific identifier (e.g., Firebase UID) */
  providerUid: ProviderUid;
}
