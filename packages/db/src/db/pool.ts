import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '../schema';
import { getConnectionString } from '../lib/utils';

export const getDrizzlePool = <
  T extends Parameters<typeof getConnectionString>[0],
>(
  config: T,
) => {
  const pool = new Pool({ connectionString: getConnectionString(config) });
  const db = drizzle(pool, { schema });
  return { pool, db };
};
