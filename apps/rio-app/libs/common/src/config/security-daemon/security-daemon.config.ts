import { CHAIN_ID, SecurityDaemonCronTaskName } from '../..';
import { SecurityDaemonServiceConfig } from './config.types';

export default (): SecurityDaemonServiceConfig => ({
  tasks: [
    {
      task: SecurityDaemonCronTaskName.SYNC_VALIDATOR_KEYS,
      chainIds: [CHAIN_ID.HOLESKY],
    },
    {
      task: SecurityDaemonCronTaskName.PROCESS_REMOVAL_QUEUE,
      chainIds: [CHAIN_ID.HOLESKY],
    },
  ],
  privateKey: process.env.SECURITY_DAEMON_PRIVATE_KEY || '',
  discordLogger: {
    warn: process.env.SECURITY_DAEMON_DISCORD_WARN_CHANNEL || '',
    error: process.env.SECURITY_DAEMON_DISCORD_ERROR_CHANNEL || '',
  },
});
