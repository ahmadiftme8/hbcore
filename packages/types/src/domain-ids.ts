import { z } from 'zod';

/**
 * Branded types for domain identifiers
 * These provide compile-time type safety while maintaining runtime compatibility
 */

// Numeric IDs
export const UserIdSchema = z.number().brand('UserId');
export type UserId = z.infer<typeof UserIdSchema>;

export const UserProfileIdSchema = z.number().brand('UserProfileId');
export type UserProfileId = z.infer<typeof UserProfileIdSchema>;

export const FirebaseAuthCredentialIdSchema = z.number().brand('FirebaseAuthCredentialId');
export type FirebaseAuthCredentialId = z.infer<typeof FirebaseAuthCredentialIdSchema>;

export const FirebaseUserMetadataIdSchema = z.number().brand('FirebaseUserMetadataId');
export type FirebaseUserMetadataId = z.infer<typeof FirebaseUserMetadataIdSchema>;

export const FirebaseCustomClaimsIdSchema = z.number().brand('FirebaseCustomClaimsId');
export type FirebaseCustomClaimsId = z.infer<typeof FirebaseCustomClaimsIdSchema>;

export const PhoneAuthCredentialIdSchema = z.number().brand('PhoneAuthCredentialId');
export type PhoneAuthCredentialId = z.infer<typeof PhoneAuthCredentialIdSchema>;

// String Identifiers
export const EmailSchema = z.string().email().brand('Email');
export type Email = z.infer<typeof EmailSchema>;

export const FirebaseUidSchema = z.string().brand('FirebaseUid');
export type FirebaseUid = z.infer<typeof FirebaseUidSchema>;

export const ProviderUidSchema = z.string().brand('ProviderUid');
export type ProviderUid = z.infer<typeof ProviderUidSchema>;

export const PhoneSchema = z.string().brand('Phone');
export type Phone = z.infer<typeof PhoneSchema>;
