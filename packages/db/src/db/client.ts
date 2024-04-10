import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres, { Sql } from 'postgres';

import { getConnectionString } from '../lib/utils';
import { apiSchema } from '../schemas';

export const getApiDrizzleClient = <
  T extends Parameters<typeof getConnectionString>[0],
>(
  config: T,
): { client: Sql; db: PostgresJsDatabase<typeof apiSchema> } => {
  const client = postgres(getConnectionString(config));
  const db = drizzle(client, { schema: apiSchema });
  return { client, db };
};
