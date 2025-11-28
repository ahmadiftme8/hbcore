/**
 * User domain type
 * 
 * Minimal user interface following the "Entity Extends Domain Type" pattern.
 * This serves as the base type that will be extended by UserEntity in the db package.
 */
export interface User {
	/** Unique identifier for the user (PostgreSQL auto-increment) */
	id: number;
}

