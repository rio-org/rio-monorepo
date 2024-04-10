import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import { type DrizzleConfig } from 'drizzle-orm';
import postgres from 'postgres';

import { apiSchema, securitySchema } from './schemas';
import { getConnectionString } from './lib/utils';
import { ENV } from './config';

(async function main(...args: string[]) {
  const flagIndex = args.findIndex((arg) =>
    ['--database', '-db'].includes((arg || '').toLowerCase()),
  );
  const migrateApi = flagIndex === -1 || /api/i.test(args[flagIndex + 1]);
  const migrateSecurity =
    flagIndex === -1 || /security/i.test(args[flagIndex + 1]);
  migrateApi && (await runMigrationForDatabase('API', { schema: apiSchema }));
  migrateSecurity &&
    (await runMigrationForDatabase('SECURITY', { schema: securitySchema }));
})().catch((error) => {
  console.error('[Error migrating database]\n', error);
  process.exit(1);
});

async function runMigrationForDatabase(
  envScope: keyof typeof ENV,
  drizzleConfig: DrizzleConfig<any>,
) {
  const connectionString = getConnectionString({
    host: ENV[envScope].DATABASE_HOST,
    port: ENV[envScope].DATABASE_PORT,
    user: ENV[envScope].DATABASE_USERNAME,
    password: ENV[envScope].DATABASE_PASSWORD,
    database: ENV[envScope].DATABASE_NAME,
  });
  const client = postgres(connectionString);
  const db = drizzle(client, drizzleConfig);
  console.log('[Migrating database]');
  await migrate(db, {
    migrationsFolder: `./drizzle/${envScope.toLowerCase()}`,
  });
  console.log('[Database migrated]');
  await client.end();
}
