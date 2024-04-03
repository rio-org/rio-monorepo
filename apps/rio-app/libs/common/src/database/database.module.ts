import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { createDynamicRootModule } from '../';
import { DatabaseModuleOptions, DatabaseProvider } from './database.types';
import { DatabaseProviders } from './database.providers';

@Global()
@Module({})
export class DatabaseModule extends createDynamicRootModule<DatabaseModuleOptions>(
  DatabaseProvider.DATABASE_MODULE_OPTIONS,
  {
    providers: [DatabaseService, DatabaseProviders.createDatabaseProvider()],
  },
) {}
