import { LiquidRestakingToken } from '@rionetwork/sdk';
import { PublicClient, WalletClient } from 'viem';

export interface RebalancerConfig {
  publicClient: PublicClient;
  walletClient: WalletClient;
  token: LiquidRestakingToken;
}
