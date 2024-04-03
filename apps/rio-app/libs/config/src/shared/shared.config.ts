import { LogLevel } from '@nestjs/common';
import { SharedConfig } from './config.types';
import { CHAIN_ID } from '@rio-app/common';

export const sharedConfigPath = 'shared.env';

export const getSharedConfig = (): SharedConfig => ({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT as string, 10) || 6379,
    db: parseInt(process.env.REDIS_DB as string, 10) || 0,
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.REDIS_TLS == 'true' ? true : false,
  },

  redisCache: {
    ttl: parseInt(process.env.REDIS_CACHE_TTL as string) || 60,
  },

  database: {
    type: 'postgres',
    healthCheckTimeout:
      parseInt(process.env.DATABASE_HEALTH_CHECK_TIMEOUT as string, 10) ||
      3_000, //ms
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT as string, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    databaseName: process.env.DATABASE_NAME || 'rio-restaking',
  },

  subgraphDatasources: [
    {
      chainId: CHAIN_ID.HOLESKY,
      apiKey: process.env.HOLESKY_SUBGRAPH_API_KEY,
      url: process.env.HOLESKY_SUBGRAPH_URL,
    },
    {
      chainId: CHAIN_ID.ETHEREUM,
      apiKey: process.env.ETHEREUM_SUBGRAPH_API_KEY,
      url: process.env.ETHEREUM_SUBGRAPH_URL,
    },
  ],

  logger: {
    general: {
      logLevels: process.env.APP_LOG_LEVELS
        ? (process.env.APP_LOG_LEVELS.split(',') as LogLevel[])
        : ['error', 'warn', 'log', 'verbose', 'debug'],
    },
  },

  httpPorts: {
    apiRio: parseInt(process.env.PORT_API_RIO as string, 10) || 4000,
    taskSchedulerService:
      parseInt(process.env.PORT_TASK_SCHEDULER as string, 10) || 4005,
  },

  localhost: process.env.LOCALHOST || '127.0.0.1',
});

export default getSharedConfig;
