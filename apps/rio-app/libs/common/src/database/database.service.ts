import { Global, Inject, Injectable } from '@nestjs/common';
import {
  DatabaseProvider,
  type DatabaseConfig,
  type DrizzleConnection,
} from './database.types';
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

  public getApiPoolConnection(): DrizzleConnection<typeof apiSchema> {
    return getDrizzlePool(this._config, { schema: apiSchema });
  }

  public getApiConnection(): DrizzleConnection<typeof apiSchema> {
    return getDrizzleClient(this._config, { schema: apiSchema });
  }

  public getSecurityPoolConnection(): DrizzleConnection<typeof securitySchema> {
    return getDrizzlePool(this._config, { schema: securitySchema });
  }

  public getSecurityConnection(): DrizzleConnection<typeof securitySchema> {
    return getDrizzleClient(this._config, { schema: securitySchema });
  }
}
