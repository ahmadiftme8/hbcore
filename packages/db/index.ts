// Import reflect-metadata for TypeORM decorators
import 'reflect-metadata';

// Connection utilities

// Re-export TypeORM types for convenience
export type { DataSource, DataSourceOptions } from 'typeorm';
export { createDataSource, type DatabaseConfig } from './src/connection.js';

// Entities
export { FirebaseAuthCredentialEntity } from './src/entities/users/firebase-auth-credential.entity.js';
export { FirebaseCustomClaimsEntity } from './src/entities/users/firebase-custom-claims.entity.js';
export { FirebaseUserMetadataEntity } from './src/entities/users/firebase-user-metadata.entity.js';
export { PhoneAuthCredentialEntity } from './src/entities/users/phone-auth-credential.entity.js';
export { UserEntity } from './src/entities/users/user.entity.js';
export { UserProfileEntity } from './src/entities/users/user-profile.entity.js';

// Repositories
export { FirebaseAuthCredentialRepository } from './src/repositories/firebase-auth-credential.repository.js';
export { FirebaseCustomClaimsRepository } from './src/repositories/firebase-custom-claims.repository.js';
export { FirebaseUserMetadataRepository } from './src/repositories/firebase-user-metadata.repository.js';
export { PhoneAuthCredentialRepository } from './src/repositories/phone-auth-credential.repository.js';
export { UserRepository } from './src/repositories/user.repository.js';
export { UserProfileRepository } from './src/repositories/user-profile.repository.js';
