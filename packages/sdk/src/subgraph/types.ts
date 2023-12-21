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

export interface TokenWrapper {
  address: Address;
  wrappedToken: Address;
  unwrappedToken: Address;
}

export interface UnderlyingToken {
  address: Address;
  symbol: string;
  name: string;
  index: number;
  strategy: Address;
  weight: string;
  balance: string;
  wrapper?: TokenWrapper;
}

export interface LiquidRestakingToken {
  address: Address;
  symbol: string;
  name: string;
  createdTimestamp: number;
  totalSupply: string;
  gateway: Address;
  poolId: string;
  underlyingTokens: UnderlyingToken[];
}

export enum JoinType {
  AllTokensExactOut = 'ALL_TOKENS_EXACT_OUT',
  TokensExactIn = 'TOKENS_EXACT_IN',
  TokenExactOut = 'TOKEN_EXACT_OUT'
}

export enum ExitType {
  TokenExactIn = 'TOKEN_EXACT_IN',
  AllTokensExactIn = 'ALL_TOKENS_EXACT_IN',
  TokensExactOut = 'TOKENS_EXACT_OUT'
}

export interface Join {
  id: string;
  type: JoinType;
  sender: Address;
  amountsIn: string[];
  amountOut: string;
  timestamp: string;
  blockNumber: string;
  tx: string;
  tokensIn: Address[];
  restakingToken: Address;
  userBalanceAfter: string;
}

export interface Exit {
  id: string;
  type: ExitType;
  sender: Address;
  tokensOut: Address[];
  amountsOut: string[];
  sharesOwed: string[];
  amountIn: string;
  restakingToken: Address;
  userBalanceAfter: string;
  timestamp: string;
  blockNumber: string;
  tx: string;
}

//#endregion
