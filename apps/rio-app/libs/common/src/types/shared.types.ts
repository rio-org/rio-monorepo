import postgres from 'postgres';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export interface DatabaseConnection {
  client: postgres.Sql;
  db: PostgresJsDatabase;
}

/**
 *  All supported utility providers
 */
export enum UtilsProvider {
  DATABASE_CONNECTION = 'DATABASE_CONNECTION',
}
