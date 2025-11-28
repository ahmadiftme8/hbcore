import { DataSource, type DataSourceOptions } from 'typeorm';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

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
