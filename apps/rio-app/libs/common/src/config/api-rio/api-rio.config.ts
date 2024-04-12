import { ApiRioConfig } from './config.types';

export default (): ApiRioConfig => ({
  throttlers: [
    {
      name: 'short',
      ttl:
        parseInt(
          process.env.API_RIO_THROTTLER_SHORT_TTL_MILLISECONDS as string,
        ) || 1_000,
      limit:
        parseInt(process.env.API_RIO_THROTTLER_SHORT_LIMIT as string) || 10,
    },
    {
      name: 'medium',
      ttl:
        parseInt(
          process.env.API_RIO_THROTTLER_MEDIUM_TTL_MILLISECONDS as string,
        ) || 10_000,
      limit:
        parseInt(process.env.API_RIO_THROTTLER_MEDIUM_LIMIT as string) || 50,
    },
    {
      name: 'long',
      ttl:
        parseInt(
          process.env.API_RIO_THROTTLER_LONG_TTL_MILLISECONDS as string,
        ) || 60_000,
      limit:
        parseInt(process.env.API_RIO_THROTTLER_LONG_LIMIT as string) || 100,
    },
  ],
  rootLocation: process.env.API_RIO_ROOT_LOCATION || '/api/v1',
});