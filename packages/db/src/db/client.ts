import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import { getConnectionString } from '../lib/utils';
import * as schema from '../schema';

export const getDrizzleClient = <
  T extends Parameters<typeof getConnectionString>[0],
>(
  config: T,
): { client: Client; db: NodePgDatabase<typeof schema> } => {
  const client = new Client({ connectionString: getConnectionString(config) });
  const db = drizzle(client, { schema });
  return { client, db };
};
