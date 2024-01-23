import { LiquidRestakingToken } from '@rionetwork/sdk';
import { PublicClient, WalletClient } from 'viem';

export interface IProcess {
  start(): void;
  stop(): void;
}

export interface RebalanceProcessConfig {
  publicClient: PublicClient;
  walletClient: WalletClient;
  token: LiquidRestakingToken;
}
