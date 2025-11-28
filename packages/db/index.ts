// Import reflect-metadata for TypeORM decorators
import 'reflect-metadata';

// Connection utilities

// Re-export TypeORM types for convenience
export type { DataSource, DataSourceOptions } from 'typeorm';
export { createDataSource, type DatabaseConfig } from './src/connection.js';
// Entities
export { UserEntity } from './src/entities/users/user.entity.js';
