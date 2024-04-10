import { Global, Inject, Injectable } from '@nestjs/common';
import {
  getApiDrizzlePool,
  getApiDrizzleClient,
  apiSchema,
  asc,
  desc,
  gt,
  gte,
  eq,
  not,
  lt,
  lte,
} from '@internal/db';
import { DatabaseConfig, DatabaseProvider } from './database.types';

@Global()
@Injectable()
export class DatabaseService {
  private get _config() {
    return {
      user: this.databaseConfiguration.username,
      password: this.databaseConfiguration.password ?? '',
      host: this.databaseConfiguration.host,
      port: this.databaseConfiguration.port,
      database: this.databaseConfiguration.databaseName,
    };
  }

  constructor(
    @Inject(DatabaseProvider.DATABASE_CONFIGURATION)
    private readonly databaseConfiguration: DatabaseConfig,
  ) {}

  public getPoolConnection(): ReturnType<typeof getApiDrizzlePool> {
    return getApiDrizzlePool(this._config);
  }

  public getConnection(): ReturnType<typeof getApiDrizzleClient> {
    return getApiDrizzleClient(this._config);
  }

  public getSchema() {
    return apiSchema;
  }

  public getOrderOperators() {
    return {
      ASC: asc,
      DESC: desc,
    };
  }

  public getComparisonOperators() {
    return {
      GT: gt,
      GTE: gte,
      EQ: eq,
      NOT: not,
      LT: lt,
      LTE: lte,
    };
  }
}
