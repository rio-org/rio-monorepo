import { DatabaseSource } from '@rio-app/common';

/**
 * Database configuration values
 */
interface DatabaseConfig extends DatabaseSource {
  healthCheckTimeout?: number;
}

/**
 * Redis configuration values
 */
interface RedisConfigFields {
  host: string;
  port: number;
  db: number;
  password: string;
  tls: boolean;
}
interface RedisConfigUrl {
  url: string;
}

type RedisConfig = RedisConfigFields | RedisConfigUrl;

export interface HealthModuleOptions {
  /**
   * Optional: if missing, database checks will be skipped
   */
  database?: DatabaseConfig;

  /**
   * Optional: if missing, redis checks will be skipped
   */
  redis?: RedisConfig;
}

export enum HealthProvider {
  HEALTH_MODULE_OPTIONS = 'HEALTH_MODULE_OPTIONS',
  HEALTH_CHECKS = 'HEALTH_CHECKS',
  HEALTH_METRIC_GAUGE = 'HEALTH_METRIC_GAUGE',
}
