import { DynamicModule, Module } from '@nestjs/common';
import {
  ChainService,
  SecurityDaemonCronTaskName,
  SecurityDaemonModuleOptions,
  SecurityDaemonProvider,
} from '@rio-app/common';
import { SecurityDaemonConfigModule } from '@rio-app/common';
import { ProcessRemovalQueueTaskManagerService } from './process-removal-queue-task-manager.service';
import { RemovalQueueUtils } from './process-removal-queue-task-manager.utils';

@Module({})
export class ProcessRemovalQueueTaskManagerModule {
  public static get task(): SecurityDaemonCronTaskName {
    return SecurityDaemonCronTaskName.PROCESS_REMOVAL_QUEUE;
  }

  /**
   * Register the module dynamically
   * @param options The cron task module options
   */
  public static register(options: SecurityDaemonModuleOptions): DynamicModule {
    const task = options?.tasks?.filter(({ task }) => task === this.task);
    if (task.length === 0) {
      return {
        module: ProcessRemovalQueueTaskManagerModule,
      };
    }

    return {
      module: ProcessRemovalQueueTaskManagerModule,
      imports: [SecurityDaemonConfigModule],
      providers: [
        ChainService,
        RemovalQueueUtils,
        ProcessRemovalQueueTaskManagerService,
        { provide: SecurityDaemonProvider.CRON_TASK, useValue: task[0] },
      ],
      exports: [ProcessRemovalQueueTaskManagerService],
    };
  }
}
