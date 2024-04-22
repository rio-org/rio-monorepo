import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres, { Sql } from 'postgres';

import { getConnectionString } from '../lib/utils';

export const getDrizzleClient = <
  TDbConfig extends Parameters<typeof getConnectionString>[0],
  TSchema extends Record<string, unknown>,
>(
  config: TDbConfig,
  drizzleConfig: { schema: TSchema },
): { client: Sql; db: PostgresJsDatabase<TSchema> } => {
  const client = postgres(getConnectionString(config));
  const db = drizzle(client, drizzleConfig);
  return { client, db };
};
