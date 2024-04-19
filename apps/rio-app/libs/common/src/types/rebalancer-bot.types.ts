import { CHAIN_ID } from './chain.types';
import { LiquidRestakingToken } from '@rionetwork/sdk';

/**
 * The configuration for single bot task
 */
export interface RebalancerBots {
  isEnabled: boolean;
  chainId: CHAIN_ID;
  rpcUrl: string;
  privateKey: `0x${string}`;
}

/**
 * Options that are passed into all cron task modules
 */
export interface RebalancerBotModuleOptions {
  bots: RebalancerBots[] | undefined;
}

/**
 * Options that are passed into all cron task modules
 */
export interface RebalancerTokenModuleOptions {
  bot: RebalancerBots;
}

/**
 * The configuration for single bot task
 */
export interface RebalancerBotConfig {
  chainId: CHAIN_ID;
  rpcUrl: string;
  privateKey: `0x${string}`;
  token: LiquidRestakingToken;
}
