import { Global, Inject, Injectable } from '@nestjs/common';
import { DatabaseProvider, type DatabaseConfig } from './database.types';
import {
  getDrizzlePool,
  getDrizzleClient,
  apiSchema,
  securitySchema,
} from '@internal/db';

@Global()
@Injectable()
export class DatabaseService {
  static readonly apiSchema = apiSchema;
  static readonly securitySchema = securitySchema;

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

  public getApiPoolConnection() {
    return getDrizzlePool(this._config, { schema: apiSchema });
  }

  public getApiConnection() {
    return getDrizzleClient(this._config, { schema: apiSchema });
  }

  public getSecurityPoolConnection() {
    return getDrizzlePool(this._config, { schema: securitySchema });
  }

  public getSecurityConnection() {
    return getDrizzleClient(this._config, { schema: securitySchema });
  }
}
