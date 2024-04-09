import { CHAIN_ID, TaskSyncDBCronTaskName } from '../../';
import { TaskSyncDBServiceConfig } from './config.types';

export default (): TaskSyncDBServiceConfig => ({
  tasks: [
    {
      task: TaskSyncDBCronTaskName.SYNC_TRANSFERS,
      chainIds: [CHAIN_ID.HOLESKY],
    },
    {
      task: TaskSyncDBCronTaskName.SYNC_EXCHANGE_RATES,
      chainIds: [CHAIN_ID.HOLESKY],
    },
  ],
});
