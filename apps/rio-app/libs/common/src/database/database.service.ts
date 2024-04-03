import { Global, Inject, Injectable } from '@nestjs/common';
import {
  getDrizzlePool,
  getDrizzleClient,
  schema,
  asc,
  desc,
  gt,
  gte,
  eq,
  not,
  lt,
  lte,
  DrizzleConnectionConfigTypes,
} from '@internal/db';
import { DatabaseConfig } from '@rio-app/config';
import { DatabaseProvider } from './database.types';

@Global()
@Injectable()
export class DatabaseService {
  private readonly _config: DrizzleConnectionConfigTypes['INDIVIDUAL'];
  private readonly _pooledConnection: ReturnType<typeof getDrizzlePool>;

  constructor(
    @Inject(DatabaseProvider.DATABASE_CONFIGURATION)
    private readonly databaseConfiguration: DatabaseConfig,
  ) {
    this._config = {
      user: databaseConfiguration.username,
      password: databaseConfiguration.password ?? '',
      host: databaseConfiguration.host,
      port: databaseConfiguration.port,
      database: databaseConfiguration.databaseName,
    };
    this._pooledConnection = getDrizzlePool(this._config);
  }

  public getPoolConnection(): ReturnType<typeof getDrizzlePool> {
    return getDrizzlePool(this._config);
  }

  public getConnection(): ReturnType<typeof getDrizzleClient> {
    return getDrizzleClient(this._config);
  }

  public getSchema() {
    return schema;
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
