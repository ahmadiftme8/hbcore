// Domain types

export type { AuthCredential, AuthResult, FirebaseAuthCredential, PhoneAuthCredential } from './domain/auth/index';
export { AuthProvider } from './domain/auth/index';
export type { User, UserInfo } from './domain/user';

// Branded types
export {
  type Email,
  EmailSchema,
  type FirebaseAuthCredentialId,
  FirebaseAuthCredentialIdSchema,
  type FirebaseCustomClaimsId,
  FirebaseCustomClaimsIdSchema,
  type FirebaseUid,
  FirebaseUidSchema,
  type FirebaseUserMetadataId,
  FirebaseUserMetadataIdSchema,
  type Phone,
  type PhoneAuthCredentialId,
  PhoneAuthCredentialIdSchema,
  PhoneSchema,
  type ProviderUid,
  ProviderUidSchema,
  type UserId,
  UserIdSchema,
  type UserProfileId,
  UserProfileIdSchema,
} from './src/domain-ids';

// Feature flags
export { FeatureFlag } from './src/unleash/feature-flags.enum';
export type { UnleashClientConfig, UnleashContext } from './src/unleash/types';
