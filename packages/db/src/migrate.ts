import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { apiSchema, securitySchema } from './schemas';
import { ENV } from './config';
import { getDrizzleClient } from './db';

(async function main() {
  const db = process.argv[2];
  const runApi = !db || db === '*' || db.toLowerCase() === 'api';
  const runSecurity = !db || db === '*' || db.toLowerCase() === 'security';
  runApi && (await runMigrationForDatabase('API', { schema: apiSchema }));
  runSecurity &&
    (await runMigrationForDatabase('SECURITY', { schema: securitySchema }));
})().catch((error) => {
  console.error('[Error migrating database]\n', error);
  process.exit(1);
});

async function runMigrationForDatabase(
  envScope: keyof typeof ENV,
  drizzleConfig: Parameters<typeof getDrizzleClient>[1],
) {
  console.log(`[Migrating ${envScope} database]`);

  const { client, db } = getDrizzleClient(
    {
      host: ENV[envScope].DATABASE_HOST,
      port: ENV[envScope].DATABASE_PORT,
      user: ENV[envScope].DATABASE_USERNAME,
      password: ENV[envScope].DATABASE_PASSWORD,
      database: ENV[envScope].DATABASE_NAME,
    },
    drizzleConfig,
  );

  await migrate(db, getDrizzleMigrationConfig(envScope));

  console.log(`[${envScope} database migrated]`);

  await client.end();
}

function getDrizzleMigrationConfig(envScope: keyof typeof ENV) {
  const scope = envScope.toLowerCase();
  return {
    migrationsFolder: `./drizzle/${envScope.toLowerCase()}`,
    migrationsSchema: scope === 'api' ? undefined : `drizzle_${scope}`,
    migrationsTable:
      scope === 'api' ? undefined : `__drizzle_${scope}_migrations`,
  };
}
