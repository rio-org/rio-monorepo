import { CHAIN_ID, CronTaskName } from '../../';
import { TaskSchedulerServiceConfig } from './config.types';

export default (): TaskSchedulerServiceConfig => ({
  tasks: [
    {
      task: CronTaskName.SYNC_TRANSFERS,
      chainIds: [CHAIN_ID.HOLESKY],
    },
    {
      task: CronTaskName.SYNC_EXCHANGE_RATES,
      chainIds: [CHAIN_ID.HOLESKY],
    },
  ],
});
