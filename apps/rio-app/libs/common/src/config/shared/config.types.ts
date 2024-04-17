import { CHAIN_ID, DatabaseConfig, LoggerModuleOptions } from '../../';

/**
 * Redis configuration values
 */
export interface RedisConfig {
  host: string;
  port: number;
  db: number;
  password: string | undefined;
  tls: boolean | any;
  url?: string;
}

export interface SubgraphDatasource {
  chainId: CHAIN_ID;
  apiKey: string;
  url: string;
}

/**
 * Redis Cache via Cache-Manager configuration values, note this is NOT for RedisCacheService (redis.service.ts)
 */
export interface RedisCacheConfig {
  ttl?: number;
}

/**
 * Service HTTP Ports
 */
export interface HttpPortConfig {
  apiRio: number;
  taskSyncDBService: number;
  securityDaemonService: number;
}

/**
 * Discord configuration values
 */
export interface DiscordConfig {
  token: string;
}

/**
 * Common configuration values
 */
export interface SharedConfig {
  database: DatabaseConfig;
  subgraphDatasources: Array<SubgraphDatasource>;
  httpPorts: HttpPortConfig;
  redis: RedisConfig;
  redisCache: RedisCacheConfig;
  logger: LoggerModuleOptions;
  discord: DiscordConfig;
  localhost: string;
}

/**
 * A type used to combine an app-specific config with the shared config
 */
export type ExtendsShared<T> = T & SharedConfig;
