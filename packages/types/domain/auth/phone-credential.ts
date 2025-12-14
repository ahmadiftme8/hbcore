import type { Phone } from '../../src/domain-ids';
import type { AuthCredential } from './credential';
import { AuthProvider } from './provider';

/**
 * Phone-specific authentication credential
 */
export interface PhoneAuthCredential extends AuthCredential {
  provider: AuthProvider.PHONE;
  /** Phone number in E.164 format */
  phone: Phone;
}
