import { CHAIN_ID, CronTaskName } from '@rio-app/common';
import { TaskSchedulerServiceConfig } from './config.types';

export default (): TaskSchedulerServiceConfig => ({
  tasks: [
    {
      task: CronTaskName.IMPORT_DATA,
      chainId: CHAIN_ID.HOLESKY,
    },
  ],
});
