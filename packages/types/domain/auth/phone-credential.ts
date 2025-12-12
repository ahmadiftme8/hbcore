import type { Phone } from '../../src/domain-ids.js';
import type { AuthCredential } from './credential.js';
import { AuthProvider } from './provider.js';

/**
 * Phone-specific authentication credential
 */
export interface PhoneAuthCredential extends AuthCredential {
  provider: AuthProvider.PHONE;
  /** Phone number in E.164 format */
  phone: Phone;
}
