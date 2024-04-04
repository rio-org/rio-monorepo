import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { getConnectionString } from './lib/utils';
import * as schema from './schema';
import { ENV } from './config';

(async function main() {
  const connectionString = getConnectionString({
    host: ENV.DATABASE_HOST,
    port: ENV.DATABASE_PORT,
    user: ENV.DATABASE_USERNAME,
    password: ENV.DATABASE_PASSWORD,
    database: ENV.DATABASE_NAME,
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
