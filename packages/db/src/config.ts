import 'dotenv/config';
import { DatabaseEnvironment } from './types';

const DEFAULTS = {
  HOST: 'localhost',
  PORT: '5432',
  USERNAME: 'postgres',
  PASSWORD: 'postgres',
} as const;

const API: DatabaseEnvironment = {
  DATABASE_HOST: process.env.DATABASE_HOST || DEFAULTS.HOST,
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT || DEFAULTS.PORT),
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || DEFAULTS.USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || DEFAULTS.PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME || 'rio-restaking',
};

const SECURITY: DatabaseEnvironment = {
  DATABASE_HOST: process.env.DATABASE_SECURITY_HOST || API.DATABASE_HOST,
  DATABASE_PORT: parseInt(
    process.env.DATABASE_SECURITY_PORT || `${API.DATABASE_PORT}`,
  ),
  DATABASE_USERNAME:
    process.env.DATABASE_SECURITY_USERNAME || API.DATABASE_USERNAME,
  DATABASE_PASSWORD:
    process.env.DATABASE_SECURITY_PASSWORD || API.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_SECURITY_NAME || 'security-daemon',
};

export const ENV: { API: DatabaseEnvironment; SECURITY: DatabaseEnvironment } =
  {
    API,
    SECURITY,
  };
