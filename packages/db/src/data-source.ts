// Import reflect-metadata for TypeORM decorators
import 'reflect-metadata';

import { join } from 'node:path';
import { config } from '@dotenvx/dotenvx';
import { DataSource, type DataSourceOptions } from 'typeorm';

// Load environment variables from .env file at package root
// Using process.cwd() for compatibility with both ESM and CommonJS contexts
config({ path: join(process.cwd(), '.env') });

/**
 * Configure SSL for PostgreSQL connection
 * If POSTGRES_SSL is set to 'false' or '0', SSL is disabled
 * Otherwise, SSL is enabled (required by some database providers)
 * For local development with self-signed certs, rejectUnauthorized is set to false
 */
const getSslConfig = () => {
  const sslEnv = process.env.POSTGRES_SSL?.toLowerCase();
  if (sslEnv === 'false' || sslEnv === '0') {
    return false;
  }
  // SSL is required - for local/dev, allow self-signed certificates
  return {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  };
};

/**
 * DataSource instance for TypeORM CLI migrations.
 * Reads configuration from environment variables.
 * Uses relative paths to avoid import resolution issues with TypeORM CLI.
 */
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number.parseInt(process.env.POSTGRES_PORT as string, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  ssl: getSslConfig(),
  entities: ['src/entities/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
} as DataSourceOptions);

export default dataSource;
