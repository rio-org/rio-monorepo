import { CHAIN_ID } from '../../';
import { RebalancerBotServiceConfig } from './config.types';

export default (): RebalancerBotServiceConfig => ({
  bots: [
    {
      isEnabled: process.env.HOLESKY_BOT_ENABLED === 'true' || false,
      chainId: CHAIN_ID.HOLESKY,
      rpcUrl: process.env.HOLESKY_RPC_URL,
      privateKey: process.env.HOLESKY_PRIVATE_KEY as `0x${string}`,
    },
    {
      isEnabled: process.env.ETHEREUM_BOT_ENABLED === 'true' || false,
      chainId: CHAIN_ID.ETHEREUM,
      rpcUrl: process.env.ETHEREUM_RPC_URL,
      privateKey: process.env.ETHEREUM_PRIVATE_KEY as `0x${string}`,
    },
  ],
});
