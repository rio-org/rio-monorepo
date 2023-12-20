/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigDecimal: { input: any; output: any };
  BigInt: { input: any; output: any };
  Bytes: { input: any; output: any };
  /**
   * 8 bytes signed integer
   *
   */
  Int8: { input: any; output: any };
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type CircuitBreaker = {
  __typename?: 'CircuitBreaker';
  id: Scalars['ID']['output'];
  lowerBoundPercentage: Scalars['BigDecimal']['output'];
  restakingTokenPrice: Scalars['BigDecimal']['output'];
  token: UnderlyingToken;
  upperBoundPercentage: Scalars['BigDecimal']['output'];
};

export type CircuitBreaker_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<CircuitBreaker_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lowerBoundPercentage?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lowerBoundPercentage_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  or?: InputMaybe<Array<InputMaybe<CircuitBreaker_Filter>>>;
  restakingTokenPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  restakingTokenPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPrice_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<UnderlyingToken_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  upperBoundPercentage?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  upperBoundPercentage_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
};

export enum CircuitBreaker_OrderBy {
  Id = 'id',
  LowerBoundPercentage = 'lowerBoundPercentage',
  RestakingTokenPrice = 'restakingTokenPrice',
  Token = 'token',
  TokenAddress = 'token__address',
  TokenBalance = 'token__balance',
  TokenCashBalance = 'token__cashBalance',
  TokenId = 'token__id',
  TokenIndex = 'token__index',
  TokenManagedBalance = 'token__managedBalance',
  TokenStrategy = 'token__strategy',
  TokenWeight = 'token__weight',
  UpperBoundPercentage = 'upperBoundPercentage'
}

export type Exit = {
  __typename?: 'Exit';
  amountIn: Scalars['BigDecimal']['output'];
  amountsOut: Array<Scalars['BigDecimal']['output']>;
  blockNumber: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  restakingToken: LiquidRestakingToken;
  sender: Scalars['Bytes']['output'];
  sharesOwed: Array<Scalars['BigDecimal']['output']>;
  timestamp: Scalars['BigInt']['output'];
  tokensOut: Array<Token>;
  tx: Scalars['Bytes']['output'];
  type: ExitType;
  user: User;
  userBalanceAfter: Scalars['BigDecimal']['output'];
  userBalanceBefore: Scalars['BigDecimal']['output'];
  valueUSD?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ExitTokensOutArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Token_Filter>;
};

export enum ExitType {
  AllTokensExactIn = 'ALL_TOKENS_EXACT_IN',
  TokensExactOut = 'TOKENS_EXACT_OUT',
  TokenExactIn = 'TOKEN_EXACT_IN'
}

export type Exit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountIn?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountIn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountsOut?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountsOut_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountsOut_contains_nocase?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  amountsOut_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountsOut_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountsOut_not_contains_nocase?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  and?: InputMaybe<Array<InputMaybe<Exit_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Exit_Filter>>>;
  restakingToken?: InputMaybe<Scalars['String']['input']>;
  restakingToken_?: InputMaybe<LiquidRestakingToken_Filter>;
  restakingToken_contains?: InputMaybe<Scalars['String']['input']>;
  restakingToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_gt?: InputMaybe<Scalars['String']['input']>;
  restakingToken_gte?: InputMaybe<Scalars['String']['input']>;
  restakingToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  restakingToken_lt?: InputMaybe<Scalars['String']['input']>;
  restakingToken_lte?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  restakingToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  restakingToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['Bytes']['input']>;
  sender_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sharesOwed?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sharesOwed_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sharesOwed_contains_nocase?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  sharesOwed_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sharesOwed_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sharesOwed_not_contains_nocase?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokensOut?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensOut_?: InputMaybe<Token_Filter>;
  tokensOut_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensOut_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensOut_not?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensOut_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensOut_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  tx?: InputMaybe<Scalars['Bytes']['input']>;
  tx_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tx_gt?: InputMaybe<Scalars['Bytes']['input']>;
  tx_gte?: InputMaybe<Scalars['Bytes']['input']>;
  tx_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tx_lt?: InputMaybe<Scalars['Bytes']['input']>;
  tx_lte?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  type?: InputMaybe<ExitType>;
  type_in?: InputMaybe<Array<ExitType>>;
  type_not?: InputMaybe<ExitType>;
  type_not_in?: InputMaybe<Array<ExitType>>;
  user?: InputMaybe<Scalars['String']['input']>;
  userBalanceAfter?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  userBalanceAfter_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  userBalanceBefore?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  userBalanceBefore_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum Exit_OrderBy {
  AmountIn = 'amountIn',
  AmountsOut = 'amountsOut',
  BlockNumber = 'blockNumber',
  Id = 'id',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenPoolId = 'restakingToken__poolId',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  Sender = 'sender',
  SharesOwed = 'sharesOwed',
  Timestamp = 'timestamp',
  TokensOut = 'tokensOut',
  Tx = 'tx',
  Type = 'type',
  User = 'user',
  UserBalanceAfter = 'userBalanceAfter',
  UserBalanceBefore = 'userBalanceBefore',
  UserAddress = 'user__address',
  UserBalance = 'user__balance',
  UserId = 'user__id',
  ValueUsd = 'valueUSD'
}

export type Gateway = {
  __typename?: 'Gateway';
  address: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  restakingToken: LiquidRestakingToken;
};

export type Gateway_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Gateway_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Gateway_Filter>>>;
  restakingToken?: InputMaybe<Scalars['String']['input']>;
  restakingToken_?: InputMaybe<LiquidRestakingToken_Filter>;
  restakingToken_contains?: InputMaybe<Scalars['String']['input']>;
  restakingToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_gt?: InputMaybe<Scalars['String']['input']>;
  restakingToken_gte?: InputMaybe<Scalars['String']['input']>;
  restakingToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  restakingToken_lt?: InputMaybe<Scalars['String']['input']>;
  restakingToken_lte?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  restakingToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  restakingToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Gateway_OrderBy {
  Address = 'address',
  Id = 'id',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenPoolId = 'restakingToken__poolId',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply'
}

export type Issuer = {
  __typename?: 'Issuer';
  address: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  tokens?: Maybe<Array<LiquidRestakingToken>>;
  tokensIssued: Scalars['Int']['output'];
};

export type IssuerTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidRestakingToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LiquidRestakingToken_Filter>;
};

export type Issuer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Issuer_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Issuer_Filter>>>;
  tokensIssued?: InputMaybe<Scalars['Int']['input']>;
  tokensIssued_gt?: InputMaybe<Scalars['Int']['input']>;
  tokensIssued_gte?: InputMaybe<Scalars['Int']['input']>;
  tokensIssued_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokensIssued_lt?: InputMaybe<Scalars['Int']['input']>;
  tokensIssued_lte?: InputMaybe<Scalars['Int']['input']>;
  tokensIssued_not?: InputMaybe<Scalars['Int']['input']>;
  tokensIssued_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokens_?: InputMaybe<LiquidRestakingToken_Filter>;
};

export enum Issuer_OrderBy {
  Address = 'address',
  Id = 'id',
  Tokens = 'tokens',
  TokensIssued = 'tokensIssued'
}

export type Join = {
  __typename?: 'Join';
  amountOut: Scalars['BigDecimal']['output'];
  amountsIn: Array<Scalars['BigDecimal']['output']>;
  blockNumber: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  restakingToken: LiquidRestakingToken;
  sender: Scalars['Bytes']['output'];
  timestamp: Scalars['BigInt']['output'];
  tokensIn: Array<Token>;
  tx: Scalars['Bytes']['output'];
  type: JoinType;
  user: User;
  userBalanceAfter: Scalars['BigDecimal']['output'];
  userBalanceBefore: Scalars['BigDecimal']['output'];
  valueUSD?: Maybe<Scalars['BigDecimal']['output']>;
};

export type JoinTokensInArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Token_Filter>;
};

export enum JoinType {
  AllTokensExactOut = 'ALL_TOKENS_EXACT_OUT',
  TokensExactIn = 'TOKENS_EXACT_IN',
  TokenExactOut = 'TOKEN_EXACT_OUT'
}

export type Join_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountOut?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountOut_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountsIn?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountsIn_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountsIn_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountsIn_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountsIn_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountsIn_not_contains_nocase?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  and?: InputMaybe<Array<InputMaybe<Join_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Join_Filter>>>;
  restakingToken?: InputMaybe<Scalars['String']['input']>;
  restakingToken_?: InputMaybe<LiquidRestakingToken_Filter>;
  restakingToken_contains?: InputMaybe<Scalars['String']['input']>;
  restakingToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_gt?: InputMaybe<Scalars['String']['input']>;
  restakingToken_gte?: InputMaybe<Scalars['String']['input']>;
  restakingToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  restakingToken_lt?: InputMaybe<Scalars['String']['input']>;
  restakingToken_lte?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  restakingToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  restakingToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['Bytes']['input']>;
  sender_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokensIn?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensIn_?: InputMaybe<Token_Filter>;
  tokensIn_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensIn_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensIn_not?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensIn_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensIn_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  tx?: InputMaybe<Scalars['Bytes']['input']>;
  tx_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tx_gt?: InputMaybe<Scalars['Bytes']['input']>;
  tx_gte?: InputMaybe<Scalars['Bytes']['input']>;
  tx_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tx_lt?: InputMaybe<Scalars['Bytes']['input']>;
  tx_lte?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  type?: InputMaybe<JoinType>;
  type_in?: InputMaybe<Array<JoinType>>;
  type_not?: InputMaybe<JoinType>;
  type_not_in?: InputMaybe<Array<JoinType>>;
  user?: InputMaybe<Scalars['String']['input']>;
  userBalanceAfter?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  userBalanceAfter_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceAfter_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  userBalanceBefore?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  userBalanceBefore_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  userBalanceBefore_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum Join_OrderBy {
  AmountOut = 'amountOut',
  AmountsIn = 'amountsIn',
  BlockNumber = 'blockNumber',
  Id = 'id',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenPoolId = 'restakingToken__poolId',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  Sender = 'sender',
  Timestamp = 'timestamp',
  TokensIn = 'tokensIn',
  Tx = 'tx',
  Type = 'type',
  User = 'user',
  UserBalanceAfter = 'userBalanceAfter',
  UserBalanceBefore = 'userBalanceBefore',
  UserAddress = 'user__address',
  UserBalance = 'user__balance',
  UserId = 'user__id',
  ValueUsd = 'valueUSD'
}

export type LiquidRestakingToken = {
  __typename?: 'LiquidRestakingToken';
  address: Scalars['Bytes']['output'];
  createdTimestamp: Scalars['Int']['output'];
  gateway: Gateway;
  id: Scalars['ID']['output'];
  issuer: Issuer;
  name: Scalars['String']['output'];
  poolId: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['BigDecimal']['output'];
  underlyingTokens?: Maybe<Array<UnderlyingToken>>;
};

export type LiquidRestakingTokenUnderlyingTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnderlyingToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UnderlyingToken_Filter>;
};

export type LiquidRestakingToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<LiquidRestakingToken_Filter>>>;
  createdTimestamp?: InputMaybe<Scalars['Int']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  gateway?: InputMaybe<Scalars['String']['input']>;
  gateway_?: InputMaybe<Gateway_Filter>;
  gateway_contains?: InputMaybe<Scalars['String']['input']>;
  gateway_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gateway_ends_with?: InputMaybe<Scalars['String']['input']>;
  gateway_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gateway_gt?: InputMaybe<Scalars['String']['input']>;
  gateway_gte?: InputMaybe<Scalars['String']['input']>;
  gateway_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gateway_lt?: InputMaybe<Scalars['String']['input']>;
  gateway_lte?: InputMaybe<Scalars['String']['input']>;
  gateway_not?: InputMaybe<Scalars['String']['input']>;
  gateway_not_contains?: InputMaybe<Scalars['String']['input']>;
  gateway_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gateway_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  gateway_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gateway_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gateway_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  gateway_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gateway_starts_with?: InputMaybe<Scalars['String']['input']>;
  gateway_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  issuer?: InputMaybe<Scalars['String']['input']>;
  issuer_?: InputMaybe<Issuer_Filter>;
  issuer_contains?: InputMaybe<Scalars['String']['input']>;
  issuer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  issuer_ends_with?: InputMaybe<Scalars['String']['input']>;
  issuer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  issuer_gt?: InputMaybe<Scalars['String']['input']>;
  issuer_gte?: InputMaybe<Scalars['String']['input']>;
  issuer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  issuer_lt?: InputMaybe<Scalars['String']['input']>;
  issuer_lte?: InputMaybe<Scalars['String']['input']>;
  issuer_not?: InputMaybe<Scalars['String']['input']>;
  issuer_not_contains?: InputMaybe<Scalars['String']['input']>;
  issuer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  issuer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  issuer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  issuer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  issuer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  issuer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  issuer_starts_with?: InputMaybe<Scalars['String']['input']>;
  issuer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<LiquidRestakingToken_Filter>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  underlyingTokens_?: InputMaybe<UnderlyingToken_Filter>;
};

export enum LiquidRestakingToken_OrderBy {
  Address = 'address',
  CreatedTimestamp = 'createdTimestamp',
  Gateway = 'gateway',
  GatewayAddress = 'gateway__address',
  GatewayId = 'gateway__id',
  Id = 'id',
  Issuer = 'issuer',
  IssuerAddress = 'issuer__address',
  IssuerId = 'issuer__id',
  IssuerTokensIssued = 'issuer__tokensIssued',
  Name = 'name',
  PoolId = 'poolId',
  Symbol = 'symbol',
  TotalSupply = 'totalSupply',
  UnderlyingTokens = 'underlyingTokens'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  circuitBreaker?: Maybe<CircuitBreaker>;
  circuitBreakers: Array<CircuitBreaker>;
  exit?: Maybe<Exit>;
  exits: Array<Exit>;
  gateway?: Maybe<Gateway>;
  gateways: Array<Gateway>;
  issuer?: Maybe<Issuer>;
  issuers: Array<Issuer>;
  join?: Maybe<Join>;
  joins: Array<Join>;
  liquidRestakingToken?: Maybe<LiquidRestakingToken>;
  liquidRestakingTokens: Array<LiquidRestakingToken>;
  token?: Maybe<Token>;
  tokenWrapper?: Maybe<TokenWrapper>;
  tokenWrapperFactories: Array<TokenWrapperFactory>;
  tokenWrapperFactory?: Maybe<TokenWrapperFactory>;
  tokenWrappers: Array<TokenWrapper>;
  tokens: Array<Token>;
  underlyingToken?: Maybe<UnderlyingToken>;
  underlyingTokens: Array<UnderlyingToken>;
  user?: Maybe<User>;
  users: Array<User>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryCircuitBreakerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCircuitBreakersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CircuitBreaker_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CircuitBreaker_Filter>;
};

export type QueryExitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryExitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Exit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Exit_Filter>;
};

export type QueryGatewayArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryGatewaysArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Gateway_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Gateway_Filter>;
};

export type QueryIssuerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryIssuersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Issuer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Issuer_Filter>;
};

export type QueryJoinArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryJoinsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Join_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Join_Filter>;
};

export type QueryLiquidRestakingTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidRestakingTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidRestakingToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidRestakingToken_Filter>;
};

export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenWrapperArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenWrapperFactoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenWrapperFactory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenWrapperFactory_Filter>;
};

export type QueryTokenWrapperFactoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenWrappersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenWrapper_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenWrapper_Filter>;
};

export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type QueryUnderlyingTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUnderlyingTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnderlyingToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UnderlyingToken_Filter>;
};

export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  circuitBreaker?: Maybe<CircuitBreaker>;
  circuitBreakers: Array<CircuitBreaker>;
  exit?: Maybe<Exit>;
  exits: Array<Exit>;
  gateway?: Maybe<Gateway>;
  gateways: Array<Gateway>;
  issuer?: Maybe<Issuer>;
  issuers: Array<Issuer>;
  join?: Maybe<Join>;
  joins: Array<Join>;
  liquidRestakingToken?: Maybe<LiquidRestakingToken>;
  liquidRestakingTokens: Array<LiquidRestakingToken>;
  token?: Maybe<Token>;
  tokenWrapper?: Maybe<TokenWrapper>;
  tokenWrapperFactories: Array<TokenWrapperFactory>;
  tokenWrapperFactory?: Maybe<TokenWrapperFactory>;
  tokenWrappers: Array<TokenWrapper>;
  tokens: Array<Token>;
  underlyingToken?: Maybe<UnderlyingToken>;
  underlyingTokens: Array<UnderlyingToken>;
  user?: Maybe<User>;
  users: Array<User>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionCircuitBreakerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCircuitBreakersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CircuitBreaker_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CircuitBreaker_Filter>;
};

export type SubscriptionExitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionExitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Exit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Exit_Filter>;
};

export type SubscriptionGatewayArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionGatewaysArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Gateway_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Gateway_Filter>;
};

export type SubscriptionIssuerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionIssuersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Issuer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Issuer_Filter>;
};

export type SubscriptionJoinArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionJoinsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Join_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Join_Filter>;
};

export type SubscriptionLiquidRestakingTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidRestakingTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidRestakingToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidRestakingToken_Filter>;
};

export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenWrapperArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenWrapperFactoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenWrapperFactory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenWrapperFactory_Filter>;
};

export type SubscriptionTokenWrapperFactoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenWrappersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenWrapper_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenWrapper_Filter>;
};

export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type SubscriptionUnderlyingTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUnderlyingTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnderlyingToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UnderlyingToken_Filter>;
};

export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Token = {
  __typename?: 'Token';
  address: Scalars['Bytes']['output'];
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  latestUSDPrice?: Maybe<Scalars['BigDecimal']['output']>;
  latestUSDPriceTimestamp?: Maybe<Scalars['BigInt']['output']>;
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  wrapper?: Maybe<TokenWrapper>;
};

export type TokenWrapper = {
  __typename?: 'TokenWrapper';
  address: Scalars['Bytes']['output'];
  factory: TokenWrapperFactory;
  id: Scalars['ID']['output'];
  unwrappedToken: Token;
  wrappedToken: Token;
};

export type TokenWrapperFactory = {
  __typename?: 'TokenWrapperFactory';
  address: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  tokenWrappers?: Maybe<Array<TokenWrapper>>;
};

export type TokenWrapperFactoryTokenWrappersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenWrapper_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenWrapper_Filter>;
};

export type TokenWrapperFactory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<TokenWrapperFactory_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenWrapperFactory_Filter>>>;
  tokenWrappers_?: InputMaybe<TokenWrapper_Filter>;
};

export enum TokenWrapperFactory_OrderBy {
  Address = 'address',
  Id = 'id',
  TokenWrappers = 'tokenWrappers'
}

export type TokenWrapper_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<TokenWrapper_Filter>>>;
  factory?: InputMaybe<Scalars['String']['input']>;
  factory_?: InputMaybe<TokenWrapperFactory_Filter>;
  factory_contains?: InputMaybe<Scalars['String']['input']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_gt?: InputMaybe<Scalars['String']['input']>;
  factory_gte?: InputMaybe<Scalars['String']['input']>;
  factory_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_lt?: InputMaybe<Scalars['String']['input']>;
  factory_lte?: InputMaybe<Scalars['String']['input']>;
  factory_not?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenWrapper_Filter>>>;
  unwrappedToken?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_?: InputMaybe<Token_Filter>;
  unwrappedToken_contains?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_gt?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_gte?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  unwrappedToken_lt?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_lte?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_not?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  unwrappedToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  unwrappedToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  unwrappedToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedToken?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_?: InputMaybe<Token_Filter>;
  wrappedToken_contains?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_gt?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_gte?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wrappedToken_lt?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_lte?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_not?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wrappedToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  wrappedToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum TokenWrapper_OrderBy {
  Address = 'address',
  Factory = 'factory',
  FactoryAddress = 'factory__address',
  FactoryId = 'factory__id',
  Id = 'id',
  UnwrappedToken = 'unwrappedToken',
  UnwrappedTokenAddress = 'unwrappedToken__address',
  UnwrappedTokenDecimals = 'unwrappedToken__decimals',
  UnwrappedTokenId = 'unwrappedToken__id',
  UnwrappedTokenLatestUsdPrice = 'unwrappedToken__latestUSDPrice',
  UnwrappedTokenLatestUsdPriceTimestamp = 'unwrappedToken__latestUSDPriceTimestamp',
  UnwrappedTokenName = 'unwrappedToken__name',
  UnwrappedTokenSymbol = 'unwrappedToken__symbol',
  WrappedToken = 'wrappedToken',
  WrappedTokenAddress = 'wrappedToken__address',
  WrappedTokenDecimals = 'wrappedToken__decimals',
  WrappedTokenId = 'wrappedToken__id',
  WrappedTokenLatestUsdPrice = 'wrappedToken__latestUSDPrice',
  WrappedTokenLatestUsdPriceTimestamp = 'wrappedToken__latestUSDPriceTimestamp',
  WrappedTokenName = 'wrappedToken__name',
  WrappedTokenSymbol = 'wrappedToken__symbol'
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  latestUSDPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPriceTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestUSDPriceTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_not_in?: InputMaybe<
    Array<Scalars['BigInt']['input']>
  >;
  latestUSDPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  latestUSDPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrapper?: InputMaybe<Scalars['String']['input']>;
  wrapper_?: InputMaybe<TokenWrapper_Filter>;
  wrapper_contains?: InputMaybe<Scalars['String']['input']>;
  wrapper_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wrapper_ends_with?: InputMaybe<Scalars['String']['input']>;
  wrapper_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrapper_gt?: InputMaybe<Scalars['String']['input']>;
  wrapper_gte?: InputMaybe<Scalars['String']['input']>;
  wrapper_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wrapper_lt?: InputMaybe<Scalars['String']['input']>;
  wrapper_lte?: InputMaybe<Scalars['String']['input']>;
  wrapper_not?: InputMaybe<Scalars['String']['input']>;
  wrapper_not_contains?: InputMaybe<Scalars['String']['input']>;
  wrapper_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wrapper_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  wrapper_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrapper_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wrapper_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  wrapper_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrapper_starts_with?: InputMaybe<Scalars['String']['input']>;
  wrapper_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Token_OrderBy {
  Address = 'address',
  Decimals = 'decimals',
  Id = 'id',
  LatestUsdPrice = 'latestUSDPrice',
  LatestUsdPriceTimestamp = 'latestUSDPriceTimestamp',
  Name = 'name',
  Symbol = 'symbol',
  Wrapper = 'wrapper',
  WrapperAddress = 'wrapper__address',
  WrapperId = 'wrapper__id'
}

export type UnderlyingToken = {
  __typename?: 'UnderlyingToken';
  address: Scalars['Bytes']['output'];
  balance: Scalars['BigDecimal']['output'];
  cashBalance: Scalars['BigDecimal']['output'];
  circuitBreaker?: Maybe<CircuitBreaker>;
  id: Scalars['ID']['output'];
  index: Scalars['Int']['output'];
  managedBalance: Scalars['BigDecimal']['output'];
  restakingToken: LiquidRestakingToken;
  strategy: Scalars['Bytes']['output'];
  token: Token;
  weight: Scalars['BigDecimal']['output'];
};

export type UnderlyingToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<UnderlyingToken_Filter>>>;
  balance?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cashBalance?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cashBalance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  circuitBreaker?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_?: InputMaybe<CircuitBreaker_Filter>;
  circuitBreaker_contains?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_ends_with?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_gt?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_gte?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  circuitBreaker_lt?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_lte?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_contains?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  circuitBreaker_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  circuitBreaker_starts_with?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  index?: InputMaybe<Scalars['Int']['input']>;
  index_gt?: InputMaybe<Scalars['Int']['input']>;
  index_gte?: InputMaybe<Scalars['Int']['input']>;
  index_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  index_lt?: InputMaybe<Scalars['Int']['input']>;
  index_lte?: InputMaybe<Scalars['Int']['input']>;
  index_not?: InputMaybe<Scalars['Int']['input']>;
  index_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  managedBalance?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  managedBalance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UnderlyingToken_Filter>>>;
  restakingToken?: InputMaybe<Scalars['String']['input']>;
  restakingToken_?: InputMaybe<LiquidRestakingToken_Filter>;
  restakingToken_contains?: InputMaybe<Scalars['String']['input']>;
  restakingToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_gt?: InputMaybe<Scalars['String']['input']>;
  restakingToken_gte?: InputMaybe<Scalars['String']['input']>;
  restakingToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  restakingToken_lt?: InputMaybe<Scalars['String']['input']>;
  restakingToken_lte?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  restakingToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  restakingToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  restakingToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  strategy?: InputMaybe<Scalars['Bytes']['input']>;
  strategy_contains?: InputMaybe<Scalars['Bytes']['input']>;
  strategy_gt?: InputMaybe<Scalars['Bytes']['input']>;
  strategy_gte?: InputMaybe<Scalars['Bytes']['input']>;
  strategy_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  strategy_lt?: InputMaybe<Scalars['Bytes']['input']>;
  strategy_lte?: InputMaybe<Scalars['Bytes']['input']>;
  strategy_not?: InputMaybe<Scalars['Bytes']['input']>;
  strategy_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  strategy_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  weight_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum UnderlyingToken_OrderBy {
  Address = 'address',
  Balance = 'balance',
  CashBalance = 'cashBalance',
  CircuitBreaker = 'circuitBreaker',
  CircuitBreakerId = 'circuitBreaker__id',
  CircuitBreakerLowerBoundPercentage = 'circuitBreaker__lowerBoundPercentage',
  CircuitBreakerRestakingTokenPrice = 'circuitBreaker__restakingTokenPrice',
  CircuitBreakerUpperBoundPercentage = 'circuitBreaker__upperBoundPercentage',
  Id = 'id',
  Index = 'index',
  ManagedBalance = 'managedBalance',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenPoolId = 'restakingToken__poolId',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  Strategy = 'strategy',
  Token = 'token',
  TokenAddress = 'token__address',
  TokenDecimals = 'token__decimals',
  TokenId = 'token__id',
  TokenLatestUsdPrice = 'token__latestUSDPrice',
  TokenLatestUsdPriceTimestamp = 'token__latestUSDPriceTimestamp',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  Weight = 'weight'
}

export type User = {
  __typename?: 'User';
  address: Scalars['Bytes']['output'];
  balance: Scalars['BigDecimal']['output'];
  exits?: Maybe<Array<Exit>>;
  id: Scalars['ID']['output'];
  joins?: Maybe<Array<Join>>;
};

export type UserExitsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Exit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Exit_Filter>;
};

export type UserJoinsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Join_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Join_Filter>;
};

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<User_Filter>>>;
  balance?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  exits_?: InputMaybe<Exit_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  joins_?: InputMaybe<Join_Filter>;
  or?: InputMaybe<Array<InputMaybe<User_Filter>>>;
};

export enum User_OrderBy {
  Address = 'address',
  Balance = 'balance',
  Exits = 'exits',
  Id = 'id',
  Joins = 'joins'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type IssuerFieldsFragment = {
  __typename?: 'Issuer';
  id: string;
  address: any;
  tokensIssued: number;
  tokens?: Array<{ __typename?: 'LiquidRestakingToken'; id: string }> | null;
};

export type TokenWrapperFieldsFragment = {
  __typename?: 'TokenWrapper';
  id: string;
  address: any;
  wrappedToken: { __typename?: 'Token'; id: string };
  unwrappedToken: { __typename?: 'Token'; id: string };
};

export type LiquidRestakingTokenFieldsFragment = {
  __typename?: 'LiquidRestakingToken';
  id: string;
  address: any;
  symbol: string;
  name: string;
  createdTimestamp: number;
  totalSupply: any;
  poolId: string;
  gateway: { __typename?: 'Gateway'; id: string };
  underlyingTokens?: Array<{
    __typename?: 'UnderlyingToken';
    address: any;
    index: number;
    strategy: any;
    token: {
      __typename?: 'Token';
      symbol: string;
      name: string;
      wrapper?: {
        __typename?: 'TokenWrapper';
        id: string;
        address: any;
        wrappedToken: { __typename?: 'Token'; id: string };
        unwrappedToken: { __typename?: 'Token'; id: string };
      } | null;
    };
  }> | null;
};

export type JoinFieldsFragment = {
  __typename?: 'Join';
  id: string;
  type: JoinType;
  sender: any;
  amountsIn: Array<any>;
  amountOut: any;
  userBalanceAfter: any;
  timestamp: any;
  blockNumber: any;
  tx: any;
  tokensIn: Array<{ __typename?: 'Token'; id: string }>;
  restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
};

export type ExitFieldsFragment = {
  __typename?: 'Exit';
  id: string;
  type: ExitType;
  sender: any;
  amountsOut: Array<any>;
  sharesOwed: Array<any>;
  amountIn: any;
  userBalanceAfter: any;
  timestamp: any;
  blockNumber: any;
  tx: any;
  tokensOut: Array<{ __typename?: 'Token'; id: string }>;
  restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
};

export type IssuerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type IssuerQuery = {
  __typename?: 'Query';
  issuer?: {
    __typename?: 'Issuer';
    id: string;
    address: any;
    tokensIssued: number;
    tokens?: Array<{ __typename?: 'LiquidRestakingToken'; id: string }> | null;
  } | null;
};

export type LiquidRestakingTokenQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type LiquidRestakingTokenQuery = {
  __typename?: 'Query';
  liquidRestakingToken?: {
    __typename?: 'LiquidRestakingToken';
    id: string;
    address: any;
    symbol: string;
    name: string;
    createdTimestamp: number;
    totalSupply: any;
    poolId: string;
    gateway: { __typename?: 'Gateway'; id: string };
    underlyingTokens?: Array<{
      __typename?: 'UnderlyingToken';
      address: any;
      index: number;
      strategy: any;
      token: {
        __typename?: 'Token';
        symbol: string;
        name: string;
        wrapper?: {
          __typename?: 'TokenWrapper';
          id: string;
          address: any;
          wrappedToken: { __typename?: 'Token'; id: string };
          unwrappedToken: { __typename?: 'Token'; id: string };
        } | null;
      };
    }> | null;
  } | null;
};

export type TokenWrapperQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type TokenWrapperQuery = {
  __typename?: 'Query';
  tokenWrapper?: {
    __typename?: 'TokenWrapper';
    id: string;
    address: any;
    wrappedToken: { __typename?: 'Token'; id: string };
    unwrappedToken: { __typename?: 'Token'; id: string };
  } | null;
};

export type ManyLiquidRestakingTokensQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy?: InputMaybe<LiquidRestakingToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LiquidRestakingToken_Filter>;
}>;

export type ManyLiquidRestakingTokensQuery = {
  __typename?: 'Query';
  liquidRestakingTokens: Array<{
    __typename?: 'LiquidRestakingToken';
    id: string;
    address: any;
    symbol: string;
    name: string;
    createdTimestamp: number;
    totalSupply: any;
    poolId: string;
    gateway: { __typename?: 'Gateway'; id: string };
    underlyingTokens?: Array<{
      __typename?: 'UnderlyingToken';
      address: any;
      index: number;
      strategy: any;
      token: {
        __typename?: 'Token';
        symbol: string;
        name: string;
        wrapper?: {
          __typename?: 'TokenWrapper';
          id: string;
          address: any;
          wrappedToken: { __typename?: 'Token'; id: string };
          unwrappedToken: { __typename?: 'Token'; id: string };
        } | null;
      };
    }> | null;
  }>;
};

export type ManyTokenWrappersQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy?: InputMaybe<TokenWrapper_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TokenWrapper_Filter>;
}>;

export type ManyTokenWrappersQuery = {
  __typename?: 'Query';
  tokenWrappers: Array<{
    __typename?: 'TokenWrapper';
    id: string;
    address: any;
    wrappedToken: { __typename?: 'Token'; id: string };
    unwrappedToken: { __typename?: 'Token'; id: string };
  }>;
};

export type ManyJoinsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy?: InputMaybe<Join_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Join_Filter>;
}>;

export type ManyJoinsQuery = {
  __typename?: 'Query';
  joins: Array<{
    __typename?: 'Join';
    id: string;
    type: JoinType;
    sender: any;
    amountsIn: Array<any>;
    amountOut: any;
    userBalanceAfter: any;
    timestamp: any;
    blockNumber: any;
    tx: any;
    tokensIn: Array<{ __typename?: 'Token'; id: string }>;
    restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
  }>;
};

export type ManyExitsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy?: InputMaybe<Exit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Exit_Filter>;
}>;

export type ManyExitsQuery = {
  __typename?: 'Query';
  exits: Array<{
    __typename?: 'Exit';
    id: string;
    type: ExitType;
    sender: any;
    amountsOut: Array<any>;
    sharesOwed: Array<any>;
    amountIn: any;
    userBalanceAfter: any;
    timestamp: any;
    blockNumber: any;
    tx: any;
    tokensOut: Array<{ __typename?: 'Token'; id: string }>;
    restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
  }>;
};

export const IssuerFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'IssuerFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Issuer' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tokensIssued' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tokens' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<IssuerFieldsFragment, unknown>;
export const TokenWrapperFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TokenWrapperFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TokenWrapper' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'wrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unwrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<TokenWrapperFieldsFragment, unknown>;
export const LiquidRestakingTokenFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LiquidRestakingTokenFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'LiquidRestakingToken' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdTimestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalSupply' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gateway' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'poolId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'underlyingTokens' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'index' }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderDirection' },
                value: { kind: 'EnumValue', value: 'asc' }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'token' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'symbol' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'wrapper' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: {
                                kind: 'Name',
                                value: 'TokenWrapperFields'
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                { kind: 'Field', name: { kind: 'Name', value: 'strategy' } }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TokenWrapperFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TokenWrapper' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'wrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unwrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<LiquidRestakingTokenFieldsFragment, unknown>;
export const JoinFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'JoinFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Join' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sender' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tokensIn' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'amountsIn' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOut' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'userBalanceAfter' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<JoinFieldsFragment, unknown>;
export const ExitFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ExitFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Exit' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sender' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tokensOut' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'amountsOut' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sharesOwed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountIn' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'userBalanceAfter' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<ExitFieldsFragment, unknown>;
export const IssuerDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'issuer' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'issuer' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'IssuerFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'IssuerFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Issuer' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tokensIssued' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tokens' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<IssuerQuery, IssuerQueryVariables>;
export const LiquidRestakingTokenDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'liquidRestakingToken' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'liquidRestakingToken' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'LiquidRestakingTokenFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TokenWrapperFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TokenWrapper' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'wrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unwrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LiquidRestakingTokenFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'LiquidRestakingToken' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdTimestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalSupply' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gateway' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'poolId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'underlyingTokens' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'index' }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderDirection' },
                value: { kind: 'EnumValue', value: 'asc' }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'token' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'symbol' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'wrapper' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: {
                                kind: 'Name',
                                value: 'TokenWrapperFields'
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                { kind: 'Field', name: { kind: 'Name', value: 'strategy' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  LiquidRestakingTokenQuery,
  LiquidRestakingTokenQueryVariables
>;
export const TokenWrapperDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'tokenWrapper' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tokenWrapper' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'TokenWrapperFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TokenWrapperFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TokenWrapper' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'wrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unwrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<TokenWrapperQuery, TokenWrapperQueryVariables>;
export const ManyLiquidRestakingTokensDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manyLiquidRestakingTokens' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' }
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderBy' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'LiquidRestakingToken_orderBy' }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderDirection' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'OrderDirection' }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'where' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'LiquidRestakingToken_filter' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'liquidRestakingTokens' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'first' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderBy' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderDirection' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderDirection' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'where' }
                }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'LiquidRestakingTokenFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TokenWrapperFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TokenWrapper' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'wrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unwrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LiquidRestakingTokenFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'LiquidRestakingToken' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdTimestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalSupply' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gateway' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'poolId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'underlyingTokens' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'index' }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderDirection' },
                value: { kind: 'EnumValue', value: 'asc' }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'token' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'symbol' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'wrapper' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: {
                                kind: 'Name',
                                value: 'TokenWrapperFields'
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'index' } },
                { kind: 'Field', name: { kind: 'Name', value: 'strategy' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  ManyLiquidRestakingTokensQuery,
  ManyLiquidRestakingTokensQueryVariables
>;
export const ManyTokenWrappersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manyTokenWrappers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' }
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderBy' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'TokenWrapper_orderBy' }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderDirection' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'OrderDirection' }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'where' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'TokenWrapper_filter' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tokenWrappers' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'first' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderBy' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderDirection' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderDirection' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'where' }
                }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'TokenWrapperFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TokenWrapperFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TokenWrapper' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'wrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unwrappedToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  ManyTokenWrappersQuery,
  ManyTokenWrappersQueryVariables
>;
export const ManyJoinsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manyJoins' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' }
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderBy' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'Join_orderBy' }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderDirection' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'OrderDirection' }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'where' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'Join_filter' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joins' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'first' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderBy' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderDirection' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderDirection' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'where' }
                }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'JoinFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'JoinFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Join' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sender' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tokensIn' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'amountsIn' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOut' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'userBalanceAfter' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<ManyJoinsQuery, ManyJoinsQueryVariables>;
export const ManyExitsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manyExits' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' }
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderBy' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'Exit_orderBy' }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderDirection' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'OrderDirection' }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'where' }
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'Exit_filter' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'exits' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'first' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'skip' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'skip' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderBy' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderDirection' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderDirection' }
                }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'where' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'where' }
                }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'ExitFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ExitFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Exit' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sender' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tokensOut' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'amountsOut' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sharesOwed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountIn' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingToken' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'userBalanceAfter' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<ManyExitsQuery, ManyExitsQueryVariables>;
