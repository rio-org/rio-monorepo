import { type Config } from 'drizzle-kit';
import { ENV } from './src/config';

export default {
  schema: './src/schema',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: ENV.DATABASE_HOST,
    user: ENV.DATABASE_USERNAME,
    port: ENV.DATABASE_PORT,
    password: ENV.DATABASE_PASSWORD,
    database: ENV.DATABASE_NAME,
  },
} satisfies Config;
