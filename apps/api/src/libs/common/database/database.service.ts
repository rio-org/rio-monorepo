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
import { ConfigService } from '@nestjs/config';

@Global()
@Injectable()
export class DatabaseService {
  private readonly _config: DrizzleConnectionConfigTypes['INDIVIDUAL'];
  private readonly _pooledConnection: ReturnType<typeof getDrizzlePool>;

  constructor(private readonly configService: ConfigService) {
    this._config = {
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD') ?? '',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      database: this.configService.get('DB_NAME'),
    };
    this._pooledConnection = getDrizzlePool(this._config);
  }

  public getPoolConnection(): typeof this._pooledConnection {
    return this._pooledConnection;
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
