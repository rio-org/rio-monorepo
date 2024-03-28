import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { getConnectionString } from '../lib/utils';
import * as schema from '../schema';

export const getDrizzlePool = <
  T extends Parameters<typeof getConnectionString>[0],
>(
  config: T,
): { pool: Pool; db: NodePgDatabase<typeof schema> } => {
  const pool = new Pool({ connectionString: getConnectionString(config) });
  const db = drizzle(pool, { schema });
  return { pool, db };
};
