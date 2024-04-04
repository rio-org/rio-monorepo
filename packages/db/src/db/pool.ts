import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres, { Sql } from 'postgres';

import { getConnectionString } from '../lib/utils';
import * as schema from '../schema';

export const getDrizzlePool = <
  T extends Parameters<typeof getConnectionString>[0],
>(
  config: T,
): { client: Sql; db: PostgresJsDatabase<typeof schema> } => {
  const client = postgres(getConnectionString(config), { prepare: false });
  const db = drizzle(client, { schema });
  return { client, db };
};
