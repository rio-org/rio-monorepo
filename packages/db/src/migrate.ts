import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { ENV } from './config';
import { getDrizzleClient } from './db';

(async function main() {
  const { client, db } = getDrizzleClient({
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
  });
  await migrate(db, { migrationsFolder: '../drizzle' });
  await client.end();
})().catch((error) => {
  console.error('[Error migrating database]', error);
  process.exit(1);
});
