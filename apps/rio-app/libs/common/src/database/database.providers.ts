import { DatabaseModuleOptions, DatabaseProvider } from './database.types';

export class DatabaseProviders {
  /**
   * Create a provider for the database
   */
  public static createDatabaseProvider() {
    return {
      provide: DatabaseProvider.DATABASE_CONFIGURATION,
      useFactory: (options: DatabaseModuleOptions) => {
        return options.database;
      },
      inject: [DatabaseProvider.DATABASE_MODULE_OPTIONS],
    };
  }
}
