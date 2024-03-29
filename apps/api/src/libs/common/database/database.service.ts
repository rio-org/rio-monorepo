import { Injectable } from '@nestjs/common';
import { SharedConfigService } from '@/libs/config/shared-config/shared-config.service';
import {
  type DrizzleConnectionConfigTypes,
  schema,
  db,
  asc,
  desc,
  gt,
  gte,
  eq,
  not,
  lt,
  lte,
} from '@internal/db';

@Injectable()
export class DatabaseService {
  private readonly _config: DrizzleConnectionConfigTypes['INDIVIDUAL'];
  private readonly _pooledConnection: ReturnType<typeof db.getDrizzlePool>;

  constructor(private readonly sharedConfigService: SharedConfigService) {
    this._config = {
      user: this.sharedConfigService.get('DB_USER'),
      password: this.sharedConfigService.get('DB_PASSWORD'),
      host: this.sharedConfigService.get('DB_HOST'),
      port: this.sharedConfigService.get('DB_PORT'),
      database: this.sharedConfigService.get('DB_NAME'),
    };
    this._pooledConnection = db.getDrizzlePool(this._config);
  }

  public getPoolConnection(): typeof this._pooledConnection {
    return this._pooledConnection;
  }

  public getConnection(): ReturnType<typeof db.getDrizzleClient> {
    return db.getDrizzleClient(this._config);
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
