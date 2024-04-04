import { CHAIN_ID, CronTaskName } from '../../';
import { TaskSchedulerServiceConfig } from './config.types';
import { CronExpression } from '@nestjs/schedule';

export default (): TaskSchedulerServiceConfig => ({
  tasks: [
    {
      task: CronTaskName.SYNC_TRANSFERS,
      chainId: CHAIN_ID.HOLESKY,
      isEnabled: true,
      cronExpression: CronExpression.EVERY_MINUTE,
    },
    {
      task: CronTaskName.SYNC_EXCHANGE_RATES,
      chainId: CHAIN_ID.HOLESKY,
      isEnabled: true,
      cronExpression: '48 0-23/1 * * *',
    },
  ],
});
