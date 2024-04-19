import { DynamicModule, Module } from '@nestjs/common';
import {
  SecurityDaemonCronTaskName,
  SecurityDaemonModuleOptions,
  SecurityDaemonProvider,
} from '@rio-app/common';
import { SecurityDaemonConfigModule } from '@rio-app/common';
import { SyncValidatorKeysTaskManagerService } from './sync-validator-keys-task-manager.service';
import { SyncValidatorKeysUtils } from './sync-validator-keys-task-manager.utils';
import { BlsModule } from '@rio-app/common/bls';

@Module({})
export class SyncValidatorKeysTaskManagerModule {
  public static get task(): SecurityDaemonCronTaskName {
    return SecurityDaemonCronTaskName.SYNC_VALIDATOR_KEYS;
  }

  /**
   * Register the module dynamically
   * @param options The cron task module options
   */
  public static register(options: SecurityDaemonModuleOptions): DynamicModule {
    const task = options?.tasks?.filter(({ task }) => task === this.task);
    if (task.length === 0) {
      return {
        module: SyncValidatorKeysTaskManagerModule,
      };
    }

    return {
      module: SyncValidatorKeysTaskManagerModule,
      imports: [BlsModule, SecurityDaemonConfigModule],
      providers: [
        SyncValidatorKeysUtils,
        SyncValidatorKeysTaskManagerService,
        { provide: SecurityDaemonProvider.CRON_TASK, useValue: task[0] },
      ],
      exports: [SyncValidatorKeysTaskManagerService],
    };
  }
}
