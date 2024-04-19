import { type Config } from 'drizzle-kit';
import { ENV } from '../config';

export default {
  schema: './src/schemas/api',
  out: './drizzle/api',
  driver: 'pg',
  dbCredentials: {
    host: ENV.API.DATABASE_HOST,
    user: ENV.API.DATABASE_USERNAME,
    port: ENV.API.DATABASE_PORT,
    password: ENV.API.DATABASE_PASSWORD,
    database: ENV.API.DATABASE_NAME,
  },
} satisfies Config;
