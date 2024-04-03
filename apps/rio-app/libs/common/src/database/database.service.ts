import { Global, Injectable } from '@nestjs/common';
import {
  type DrizzleConnectionConfigTypes,
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
import { DatabaseConfig, SharedConfigService } from '@rio-app/config';

@Global()
@Injectable()
export class DatabaseService {
  static deriveConfigFromService(
    sharedConfigService: SharedConfigService<DatabaseConfig>,
  ) {
    return {
      user: sharedConfigService.database.username,
      password: sharedConfigService.database.password,
      host: sharedConfigService.database.host,
      port: sharedConfigService.database.port,
      database: sharedConfigService.database.databaseName,
    };
  }

  constructor(
    private readonly sharedConfigService: SharedConfigService<DatabaseConfig>,
  ) {}

  private get _config() {
    return DatabaseService.deriveConfigFromService(this.sharedConfigService);
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
