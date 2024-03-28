import { Injectable } from '@nestjs/common';
import { SharedConfigAdapter } from '@/shared-config/shared-config.adapter';
import { db, type DrizzleConnectionConfigTypes } from '@internal/db';

@Injectable()
export class DatabaseService {
  private readonly _config: DrizzleConnectionConfigTypes['INDIVIDUAL'];
  private readonly _pooledConnection: ReturnType<typeof db.getDrizzlePool>;

  constructor(private readonly sharedConfigService: SharedConfigAdapter) {
    this._config = {
      user: this.sharedConfigService.getEnvVar('DB_USER'),
      password: this.sharedConfigService.getEnvVar('DB_PASSWORD'),
      host: this.sharedConfigService.getEnvVar('DB_HOST'),
      port: this.sharedConfigService.getEnvVar('DB_PORT'),
      database: this.sharedConfigService.getEnvVar('DB_NAME'),
    };
    this._pooledConnection = db.getDrizzlePool(this._config);
  }

  public getPoolConnection(): typeof this._pooledConnection {
    return this._pooledConnection;
  }

  public getConnection(): ReturnType<typeof db.getDrizzleClient> {
    return db.getDrizzleClient(this._config);
  }
}
