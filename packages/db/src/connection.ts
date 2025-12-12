import { DataSource, type DataSourceOptions } from 'typeorm';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

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
 * Creates a TypeORM DataSource instance with the provided configuration.
 * This factory function allows consumers to manage their own connection instances.
 *
 * @param config - Database connection configuration
 * @param options - Optional additional TypeORM DataSourceOptions
 * @returns Configured DataSource instance
 */
export function createDataSource(config: DatabaseConfig, options?: Partial<DataSourceOptions>): DataSource {
  const baseOptions: Partial<DataSourceOptions> = {
    type: 'postgres',
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    ssl: getSslConfig(),
    entities: [`${__dirname}/entities/**/*.entity.ts`],
    migrations: [`${__dirname}/migrations/**/*.ts`],
    synchronize: false, // Always use migrations in production
    logging: process.env.NODE_ENV === 'development',
  };

  return new DataSource({
    ...baseOptions,
    ...options,
  } as DataSourceOptions);
}
