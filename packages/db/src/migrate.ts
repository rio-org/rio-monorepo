import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { getConnectionString } from './lib/utils';
import * as schema from './schema';
import { ENV } from './config';

(async function main() {
  const connectionString = getConnectionString({
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
  });
  const client = postgres(connectionString);
  const db = drizzle(client, { schema });
  console.log('[Migrating database]');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('[Database migrated]');
  await client.end();
})().catch((error) => {
  console.error('[Error migrating database]\n', error);
  process.exit(1);
});
