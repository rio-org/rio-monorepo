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

export interface Withdrawal {
  id: string;
  sender: Address;
  assetOut: Address;
  sharesOwed: string;
  amountIn: string;
  restakingToken: Address;
  userBalanceAfter: string;
  timestamp: string;
  blockNumber: string;
  requestTx: string;

  isReadyToClaim: boolean;
  isClaimed: boolean;
  amountOut?: string;
  claimTx?: string;
}

//#endregion
