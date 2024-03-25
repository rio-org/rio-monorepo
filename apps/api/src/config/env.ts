import 'dotenv/config';

export const ENV = {
  PORT: process.env.PORT || 4000,
} as const;
