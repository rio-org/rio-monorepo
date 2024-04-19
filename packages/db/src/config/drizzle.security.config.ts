import { type Config } from 'drizzle-kit';
import { ENV } from '../config';

export default {
  schema: './src/schemas/security',
  out: './drizzle/security',
  driver: 'pg',
  dbCredentials: {
    host: ENV.SECURITY.DATABASE_HOST,
    user: ENV.SECURITY.DATABASE_USERNAME,
    port: ENV.SECURITY.DATABASE_PORT,
    password: ENV.SECURITY.DATABASE_PASSWORD,
    database: ENV.SECURITY.DATABASE_NAME,
  },
} satisfies Config;
