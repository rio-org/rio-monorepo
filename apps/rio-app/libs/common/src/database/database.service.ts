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
} from '@internal/db';
import { DatabaseConfig } from '@rio-app/config';
import { DatabaseProvider } from './database.types';

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
