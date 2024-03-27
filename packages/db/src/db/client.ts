import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import * as schema from '../schema';
import { getConnectionString } from '../lib/utils';

export const getDrizzleClient = <
  T extends Parameters<typeof getConnectionString>[0],
>(
  config: T,
) => {
  const client = new Client({ connectionString: getConnectionString(config) });
  const db = drizzle(client, { schema });
  return { client, db };
};
