import { LiquidRestakingToken } from '@rionetwork/sdk';
import { PublicClient, WalletClient } from 'viem';

export interface IProcess {
  isRunning: boolean;
  start(): void;
  stop(): void;
}

export interface RebalanceProcessConfig {
  publicClient: PublicClient;
  walletClient: WalletClient;
  token: LiquidRestakingToken;
}
