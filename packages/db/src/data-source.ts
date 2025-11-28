// Import reflect-metadata for TypeORM decorators
import 'reflect-metadata';

import { join } from 'node:path';
import { config } from '@dotenvx/dotenvx';
import { DataSource, type DataSourceOptions } from 'typeorm';

// Load environment variables from .env file at package root
// Using process.cwd() for compatibility with both ESM and CommonJS contexts
config({ path: join(process.cwd(), '.env') });

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
  entities: ['src/entities/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
} as DataSourceOptions);

export default dataSource;
