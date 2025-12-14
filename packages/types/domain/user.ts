import type { Email, Phone, UserId } from '../src/domain-ids';

/**
 * User domain type
 *
 * Minimal user interface following the "Entity Extends Domain Type" pattern.
 * This serves as the base type that will be extended by UserEntity in the db package.
 */
export interface User {
  /** Unique identifier for the user (PostgreSQL auto-increment) */
  id: UserId;
}

/**
 * User profile information
 */
export interface UserInfo {
  /** User email address */
  email?: Email | null;
  /** User phone number */
  phone?: Phone | null;
  /** User display name */
  name?: string | null;
  /** User first name */
  firstname?: string | null;
  /** User last name */
  lastname?: string | null;
}
