import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CHAIN_ID,
  CronTaskName,
  DeepDotKey,
  FormatService,
} from '@rio-app/common';
import {
  DatabaseConfig,
  ExtendsShared,
  HttpPortConfig,
  RedisCacheConfig,
  RedisConfig,
  SubgraphDatasource,
} from './config.types';
import { LoggerModuleOptions } from '@rio-app/common';
import { CronTask } from '@rio-app/config/task-scheduler';

/**
 * Convenience service used to access shared configuration values
 */
@Injectable()
export class SharedConfigService<T> {
  protected readonly _accessor: DeepDotKey<ExtendsShared<T>>;

  constructor(
    protected configService: ConfigService,
    protected formatService: FormatService,
  ) {
    this._accessor = this.formatService.deepDotKey<ExtendsShared<T>>();
  }

  /**
   * Redis Cache via cache-manager configuration details --- note this is NOT for RedisCacheService (redis.service.ts)
   */
  public get redisCache(): RedisCacheConfig {
    return this.configService.get<RedisCacheConfig>(
      this._accessor.redisCache(),
    ) as RedisCacheConfig;
  }

  /**
   * Redis connection details
   */
  public get redis(): RedisConfig {
    const { host, port, db, password, tls } =
      this.configService.get<RedisConfig>(
        this._accessor.redis(),
      ) as RedisConfig;
    const schema = tls ? 'rediss://' : 'redis://';
    const prefix = password ? `${schema}:${password}@` : schema;

    return {
      host,
      port,
      db,
      password,
      tls,
      url: `${prefix}${host}:${port}/${db}`,
    };
  }

  /**
   * Database connection details
   */
  public get database(): DatabaseConfig {
    return this.configService.get<DatabaseConfig>(
      this._accessor.database(),
    ) as DatabaseConfig;
  }

  /**
   * Logger configuration details
   */
  public get logger(): LoggerModuleOptions {
    return this.configService.get<LoggerModuleOptions>(
      this._accessor.logger(),
    ) as LoggerModuleOptions;
  }

  /**
   * HTTP port details
   */
  public get httpPorts(): HttpPortConfig {
    return this.configService.get<HttpPortConfig>(
      this._accessor.httpPorts(),
    ) as HttpPortConfig;
  }

  /**
   * List of available cron tasks
   */
  public get subgraphDatasources(): SubgraphDatasource[] | undefined {
    return this.configService.get<SubgraphDatasource[]>(
      this._accessor.subgraphDatasources(),
    );
  }

  /**
   * Gets the properties of the specified cron task
   * @param chainId The chain id of the chain to fetch the subgraph for
   */
  public getSubgraphDatasource(
    chainId: CHAIN_ID,
  ): SubgraphDatasource | undefined {
    return this.subgraphDatasources?.find(
      (subgraphDatasource) => subgraphDatasource.chainId === chainId,
    );
  }

  /**
   * Determine if code is running in the development environment
   */
  public get isDevelopment(): boolean {
    if (process.env.NODE_ENV === 'production') {
      return false;
    }
    return true;
  }
}
