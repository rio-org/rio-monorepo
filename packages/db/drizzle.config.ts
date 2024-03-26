import { type Config } from 'drizzle-kit';
import { ENV } from './src/config';

export default {
  schema: './src/schema',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: ENV.DB_HOST,
    user: ENV.DB_USER,
    port: ENV.DB_PORT,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
  },
} satisfies Config;
