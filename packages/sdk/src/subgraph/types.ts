import { Address } from '../types';
import { OrderDirection } from './generated/graphql';

export interface QueryConfig<OB, W> {
  page: number;
  perPage: number;
  orderBy?: OB;
  orderDirection?: OrderDirection;
  where?: W;
}

//#region Entity Types

export interface Issuer {
  address: Address;
  tokensIssued: number;
  tokens: Address[];
}

export interface UnderlyingAsset {
  address: Address;
  symbol: string;
  name: string;
  strategy: Address;
  depositCap: string;
  priceFeed: Address;
  balance: string;
}

export interface LiquidRestakingToken {
  address: Address;
  symbol: string;
  name: string;
  createdTimestamp: number;
  totalSupply: string;
  coordinator: Address;
  underlyingAssets: UnderlyingAsset[];
}

export interface Deposit {
  id: string;
  sender: Address;
  assetIn: Address;
  amountIn: string;
  amountOut: string;
  timestamp: string;
  blockNumber: string;
  restakingToken: Address;
  userBalanceAfter: string;
  tx: string;
}

export enum WithdrawalEpochStatus {
  Active = 'ACTIVE',
  Queued = 'QUEUED',
  Settled = 'SETTLED'
}

export interface WithdrawalRequest {
  id: string;
  sender: Address;
  epoch: string;
  epochStatus: WithdrawalEpochStatus;
  assetOut: Address;
  amountOut: string | undefined; // Populated on epoch settlement.
  sharesOwed: string;
  amountIn: string;
  restakingToken: Address;
  userBalanceAfter: string;
  timestamp: string;
  blockNumber: string;
  tx: string;

  // Populated on withdrawal claim.
  isReadyToClaim: boolean;
  isClaimed: boolean;
  claimId: string | undefined;
  claimTx: string | undefined;
}

export interface WithdrawalClaim {
  id: string;
  sender: Address;
  epoch: string;
  assetOut: Address;
  amountClaimed: string;
  restakingToken: Address;
  requestIds: string[];
  timestamp: string;
  blockNumber: string;
  tx: string;
}

//#endregion
