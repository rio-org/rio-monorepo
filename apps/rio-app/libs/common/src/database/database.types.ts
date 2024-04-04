export interface DatabaseSource {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export enum DatabaseProvider {
  DATABASE_CONFIGURATION = 'DATABASE_CONFIGURATION',
  DATABASE_MODULE_OPTIONS = 'DATABASE_MODULE_OPTIONS',
}

export interface DatabaseModuleOptions {
  database: DatabaseConfig;
}

/**
 * Database configuration values
 */
export interface DatabaseConfig {
  type: 'postgres';
  healthCheckTimeout?: number;
  host: string;
  port: number;
  username: string;
  password: string;
  databaseName: string;
}
