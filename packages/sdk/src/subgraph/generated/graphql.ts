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

export type Asset = {
  __typename?: 'Asset';
  address: Scalars['Bytes']['output'];
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  latestUSDPrice?: Maybe<Scalars['BigDecimal']['output']>;
  latestUSDPriceTimestamp?: Maybe<Scalars['BigInt']['output']>;
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type Asset_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<Asset_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Asset_Filter>>>;
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
};

export enum Asset_OrderBy {
  Address = 'address',
  Decimals = 'decimals',
  Id = 'id',
  LatestUsdPrice = 'latestUSDPrice',
  LatestUsdPriceTimestamp = 'latestUSDPriceTimestamp',
  Name = 'name',
  Symbol = 'symbol'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Coordinator = {
  __typename?: 'Coordinator';
  address: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  restakingToken: LiquidRestakingToken;
};

export type Coordinator_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<Coordinator_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Coordinator_Filter>>>;
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

export enum Coordinator_OrderBy {
  Address = 'address',
  Id = 'id',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenPercentApy = 'restakingToken__percentAPY',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD'
}

export type Deposit = {
  __typename?: 'Deposit';
  amountIn: Scalars['BigDecimal']['output'];
  amountOut: Scalars['BigDecimal']['output'];
  assetIn: Asset;
  blockNumber: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  restakingToken: LiquidRestakingToken;
  sender: Scalars['Bytes']['output'];
  timestamp: Scalars['BigInt']['output'];
  tx: Scalars['Bytes']['output'];
  user: User;
  userBalanceAfter: Scalars['BigDecimal']['output'];
  userBalanceBefore: Scalars['BigDecimal']['output'];
  valueUSD?: Maybe<Scalars['BigDecimal']['output']>;
};

export type Deposit_Filter = {
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
  amountOut?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountOut_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Deposit_Filter>>>;
  assetIn?: InputMaybe<Scalars['String']['input']>;
  assetIn_?: InputMaybe<Asset_Filter>;
  assetIn_contains?: InputMaybe<Scalars['String']['input']>;
  assetIn_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetIn_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetIn_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetIn_gt?: InputMaybe<Scalars['String']['input']>;
  assetIn_gte?: InputMaybe<Scalars['String']['input']>;
  assetIn_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetIn_lt?: InputMaybe<Scalars['String']['input']>;
  assetIn_lte?: InputMaybe<Scalars['String']['input']>;
  assetIn_not?: InputMaybe<Scalars['String']['input']>;
  assetIn_not_contains?: InputMaybe<Scalars['String']['input']>;
  assetIn_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetIn_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetIn_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetIn_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetIn_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetIn_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetIn_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetIn_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  or?: InputMaybe<Array<InputMaybe<Deposit_Filter>>>;
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

export enum Deposit_OrderBy {
  AmountIn = 'amountIn',
  AmountOut = 'amountOut',
  AssetIn = 'assetIn',
  AssetInAddress = 'assetIn__address',
  AssetInDecimals = 'assetIn__decimals',
  AssetInId = 'assetIn__id',
  AssetInLatestUsdPrice = 'assetIn__latestUSDPrice',
  AssetInLatestUsdPriceTimestamp = 'assetIn__latestUSDPriceTimestamp',
  AssetInName = 'assetIn__name',
  AssetInSymbol = 'assetIn__symbol',
  BlockNumber = 'blockNumber',
  Id = 'id',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenPercentApy = 'restakingToken__percentAPY',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD',
  Sender = 'sender',
  Timestamp = 'timestamp',
  Tx = 'tx',
  User = 'user',
  UserBalanceAfter = 'userBalanceAfter',
  UserBalanceBefore = 'userBalanceBefore',
  UserAddress = 'user__address',
  UserBalance = 'user__balance',
  UserId = 'user__id',
  ValueUsd = 'valueUSD'
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

export type LiquidRestakingToken = {
  __typename?: 'LiquidRestakingToken';
  address: Scalars['Bytes']['output'];
  coordinator: Coordinator;
  createdTimestamp: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  issuer: Issuer;
  name: Scalars['String']['output'];
  percentAPY?: Maybe<Scalars['BigDecimal']['output']>;
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['BigDecimal']['output'];
  totalValueETH?: Maybe<Scalars['BigDecimal']['output']>;
  totalValueUSD?: Maybe<Scalars['BigDecimal']['output']>;
  underlyingAssets?: Maybe<Array<UnderlyingAsset>>;
  withdrawalQueue: WithdrawalQueue;
};

export type LiquidRestakingTokenUnderlyingAssetsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnderlyingAsset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UnderlyingAsset_Filter>;
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
  coordinator?: InputMaybe<Scalars['String']['input']>;
  coordinator_?: InputMaybe<Coordinator_Filter>;
  coordinator_contains?: InputMaybe<Scalars['String']['input']>;
  coordinator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  coordinator_ends_with?: InputMaybe<Scalars['String']['input']>;
  coordinator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  coordinator_gt?: InputMaybe<Scalars['String']['input']>;
  coordinator_gte?: InputMaybe<Scalars['String']['input']>;
  coordinator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  coordinator_lt?: InputMaybe<Scalars['String']['input']>;
  coordinator_lte?: InputMaybe<Scalars['String']['input']>;
  coordinator_not?: InputMaybe<Scalars['String']['input']>;
  coordinator_not_contains?: InputMaybe<Scalars['String']['input']>;
  coordinator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  coordinator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  coordinator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  coordinator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  coordinator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  coordinator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  coordinator_starts_with?: InputMaybe<Scalars['String']['input']>;
  coordinator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  percentAPY?: InputMaybe<Scalars['BigDecimal']['input']>;
  percentAPY_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  percentAPY_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  percentAPY_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  percentAPY_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  percentAPY_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  percentAPY_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  percentAPY_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  totalValueETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  underlyingAssets_?: InputMaybe<UnderlyingAsset_Filter>;
  withdrawalQueue?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_?: InputMaybe<WithdrawalQueue_Filter>;
  withdrawalQueue_contains?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_ends_with?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_gt?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_gte?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_in?: InputMaybe<Array<Scalars['String']['input']>>;
  withdrawalQueue_lt?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_lte?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_not?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_not_contains?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  withdrawalQueue_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  withdrawalQueue_starts_with?: InputMaybe<Scalars['String']['input']>;
  withdrawalQueue_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum LiquidRestakingToken_OrderBy {
  Address = 'address',
  Coordinator = 'coordinator',
  CoordinatorAddress = 'coordinator__address',
  CoordinatorId = 'coordinator__id',
  CreatedTimestamp = 'createdTimestamp',
  Id = 'id',
  Issuer = 'issuer',
  IssuerAddress = 'issuer__address',
  IssuerId = 'issuer__id',
  IssuerTokensIssued = 'issuer__tokensIssued',
  Name = 'name',
  PercentApy = 'percentAPY',
  Symbol = 'symbol',
  TotalSupply = 'totalSupply',
  TotalValueEth = 'totalValueETH',
  TotalValueUsd = 'totalValueUSD',
  UnderlyingAssets = 'underlyingAssets',
  WithdrawalQueue = 'withdrawalQueue',
  WithdrawalQueueAddress = 'withdrawalQueue__address',
  WithdrawalQueueId = 'withdrawalQueue__id'
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
  asset?: Maybe<Asset>;
  assets: Array<Asset>;
  coordinator?: Maybe<Coordinator>;
  coordinators: Array<Coordinator>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  issuer?: Maybe<Issuer>;
  issuers: Array<Issuer>;
  liquidRestakingToken?: Maybe<LiquidRestakingToken>;
  liquidRestakingTokens: Array<LiquidRestakingToken>;
  underlyingAsset?: Maybe<UnderlyingAsset>;
  underlyingAssets: Array<UnderlyingAsset>;
  user?: Maybe<User>;
  users: Array<User>;
  withdrawalClaim?: Maybe<WithdrawalClaim>;
  withdrawalClaims: Array<WithdrawalClaim>;
  withdrawalEpoch?: Maybe<WithdrawalEpoch>;
  withdrawalEpochUserSummaries: Array<WithdrawalEpochUserSummary>;
  withdrawalEpochUserSummary?: Maybe<WithdrawalEpochUserSummary>;
  withdrawalEpoches: Array<WithdrawalEpoch>;
  withdrawalQueue?: Maybe<WithdrawalQueue>;
  withdrawalQueues: Array<WithdrawalQueue>;
  withdrawalRequest?: Maybe<WithdrawalRequest>;
  withdrawalRequests: Array<WithdrawalRequest>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryAssetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAssetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Asset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Asset_Filter>;
};

export type QueryCoordinatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCoordinatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Coordinator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Coordinator_Filter>;
};

export type QueryDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
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

export type QueryUnderlyingAssetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUnderlyingAssetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnderlyingAsset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UnderlyingAsset_Filter>;
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

export type QueryWithdrawalClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryWithdrawalClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalClaim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawalClaim_Filter>;
};

export type QueryWithdrawalEpochArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryWithdrawalEpochUserSummariesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalEpochUserSummary_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawalEpochUserSummary_Filter>;
};

export type QueryWithdrawalEpochUserSummaryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryWithdrawalEpochesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalEpoch_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawalEpoch_Filter>;
};

export type QueryWithdrawalQueueArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryWithdrawalQueuesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalQueue_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawalQueue_Filter>;
};

export type QueryWithdrawalRequestArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryWithdrawalRequestsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalRequest_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawalRequest_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  asset?: Maybe<Asset>;
  assets: Array<Asset>;
  coordinator?: Maybe<Coordinator>;
  coordinators: Array<Coordinator>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  issuer?: Maybe<Issuer>;
  issuers: Array<Issuer>;
  liquidRestakingToken?: Maybe<LiquidRestakingToken>;
  liquidRestakingTokens: Array<LiquidRestakingToken>;
  underlyingAsset?: Maybe<UnderlyingAsset>;
  underlyingAssets: Array<UnderlyingAsset>;
  user?: Maybe<User>;
  users: Array<User>;
  withdrawalClaim?: Maybe<WithdrawalClaim>;
  withdrawalClaims: Array<WithdrawalClaim>;
  withdrawalEpoch?: Maybe<WithdrawalEpoch>;
  withdrawalEpochUserSummaries: Array<WithdrawalEpochUserSummary>;
  withdrawalEpochUserSummary?: Maybe<WithdrawalEpochUserSummary>;
  withdrawalEpoches: Array<WithdrawalEpoch>;
  withdrawalQueue?: Maybe<WithdrawalQueue>;
  withdrawalQueues: Array<WithdrawalQueue>;
  withdrawalRequest?: Maybe<WithdrawalRequest>;
  withdrawalRequests: Array<WithdrawalRequest>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionAssetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAssetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Asset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Asset_Filter>;
};

export type SubscriptionCoordinatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCoordinatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Coordinator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Coordinator_Filter>;
};

export type SubscriptionDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
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

export type SubscriptionUnderlyingAssetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUnderlyingAssetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UnderlyingAsset_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UnderlyingAsset_Filter>;
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

export type SubscriptionWithdrawalClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionWithdrawalClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalClaim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawalClaim_Filter>;
};

export type SubscriptionWithdrawalEpochArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionWithdrawalEpochUserSummariesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalEpochUserSummary_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawalEpochUserSummary_Filter>;
};

export type SubscriptionWithdrawalEpochUserSummaryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionWithdrawalEpochesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalEpoch_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawalEpoch_Filter>;
};

export type SubscriptionWithdrawalQueueArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionWithdrawalQueuesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalQueue_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawalQueue_Filter>;
};

export type SubscriptionWithdrawalRequestArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionWithdrawalRequestsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalRequest_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WithdrawalRequest_Filter>;
};

export type UnderlyingAsset = {
  __typename?: 'UnderlyingAsset';
  address: Scalars['Bytes']['output'];
  asset: Asset;
  balance: Scalars['BigDecimal']['output'];
  balanceInDepositPool: Scalars['BigDecimal']['output'];
  balanceInEigenLayer: Scalars['BigDecimal']['output'];
  depositCap: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  priceFeed: Scalars['Bytes']['output'];
  restakingToken: LiquidRestakingToken;
  strategy: Scalars['Bytes']['output'];
};

export type UnderlyingAsset_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<UnderlyingAsset_Filter>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_?: InputMaybe<Asset_Filter>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  balance?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInDepositPool?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInDepositPool_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInDepositPool_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInDepositPool_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balanceInDepositPool_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInDepositPool_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInDepositPool_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInDepositPool_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  balanceInEigenLayer?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInEigenLayer_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInEigenLayer_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInEigenLayer_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balanceInEigenLayer_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInEigenLayer_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInEigenLayer_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balanceInEigenLayer_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  balance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  depositCap?: InputMaybe<Scalars['BigDecimal']['input']>;
  depositCap_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  depositCap_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  depositCap_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  depositCap_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  depositCap_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  depositCap_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  depositCap_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UnderlyingAsset_Filter>>>;
  priceFeed?: InputMaybe<Scalars['Bytes']['input']>;
  priceFeed_contains?: InputMaybe<Scalars['Bytes']['input']>;
  priceFeed_gt?: InputMaybe<Scalars['Bytes']['input']>;
  priceFeed_gte?: InputMaybe<Scalars['Bytes']['input']>;
  priceFeed_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  priceFeed_lt?: InputMaybe<Scalars['Bytes']['input']>;
  priceFeed_lte?: InputMaybe<Scalars['Bytes']['input']>;
  priceFeed_not?: InputMaybe<Scalars['Bytes']['input']>;
  priceFeed_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  priceFeed_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
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
};

export enum UnderlyingAsset_OrderBy {
  Address = 'address',
  Asset = 'asset',
  AssetAddress = 'asset__address',
  AssetDecimals = 'asset__decimals',
  AssetId = 'asset__id',
  AssetLatestUsdPrice = 'asset__latestUSDPrice',
  AssetLatestUsdPriceTimestamp = 'asset__latestUSDPriceTimestamp',
  AssetName = 'asset__name',
  AssetSymbol = 'asset__symbol',
  Balance = 'balance',
  BalanceInDepositPool = 'balanceInDepositPool',
  BalanceInEigenLayer = 'balanceInEigenLayer',
  DepositCap = 'depositCap',
  Id = 'id',
  PriceFeed = 'priceFeed',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenPercentApy = 'restakingToken__percentAPY',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD',
  Strategy = 'strategy'
}

export type User = {
  __typename?: 'User';
  address: Scalars['Bytes']['output'];
  balance: Scalars['BigDecimal']['output'];
  deposits?: Maybe<Array<Deposit>>;
  id: Scalars['ID']['output'];
  withdrawalClaims?: Maybe<Array<WithdrawalClaim>>;
  withdrawalRequests?: Maybe<Array<WithdrawalRequest>>;
};

export type UserDepositsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Deposit_Filter>;
};

export type UserWithdrawalClaimsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalClaim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WithdrawalClaim_Filter>;
};

export type UserWithdrawalRequestsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalRequest_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WithdrawalRequest_Filter>;
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
  deposits_?: InputMaybe<Deposit_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<User_Filter>>>;
  withdrawalClaims_?: InputMaybe<WithdrawalClaim_Filter>;
  withdrawalRequests_?: InputMaybe<WithdrawalRequest_Filter>;
};

export enum User_OrderBy {
  Address = 'address',
  Balance = 'balance',
  Deposits = 'deposits',
  Id = 'id',
  WithdrawalClaims = 'withdrawalClaims',
  WithdrawalRequests = 'withdrawalRequests'
}

export type WithdrawalClaim = {
  __typename?: 'WithdrawalClaim';
  amountOut: Scalars['BigDecimal']['output'];
  assetOut: Asset;
  blockNumber: Scalars['BigInt']['output'];
  epoch: WithdrawalEpoch;
  id: Scalars['ID']['output'];
  requests?: Maybe<Array<WithdrawalRequest>>;
  restakingToken: LiquidRestakingToken;
  sender: Scalars['Bytes']['output'];
  timestamp: Scalars['BigInt']['output'];
  tx: Scalars['Bytes']['output'];
  user: User;
};

export type WithdrawalClaimRequestsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalRequest_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WithdrawalRequest_Filter>;
};

export type WithdrawalClaim_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<WithdrawalClaim_Filter>>>;
  assetOut?: InputMaybe<Scalars['String']['input']>;
  assetOut_?: InputMaybe<Asset_Filter>;
  assetOut_contains?: InputMaybe<Scalars['String']['input']>;
  assetOut_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetOut_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetOut_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetOut_gt?: InputMaybe<Scalars['String']['input']>;
  assetOut_gte?: InputMaybe<Scalars['String']['input']>;
  assetOut_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetOut_lt?: InputMaybe<Scalars['String']['input']>;
  assetOut_lte?: InputMaybe<Scalars['String']['input']>;
  assetOut_not?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_contains?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetOut_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetOut_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetOut_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  epoch?: InputMaybe<Scalars['String']['input']>;
  epoch_?: InputMaybe<WithdrawalEpoch_Filter>;
  epoch_contains?: InputMaybe<Scalars['String']['input']>;
  epoch_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_ends_with?: InputMaybe<Scalars['String']['input']>;
  epoch_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_gt?: InputMaybe<Scalars['String']['input']>;
  epoch_gte?: InputMaybe<Scalars['String']['input']>;
  epoch_in?: InputMaybe<Array<Scalars['String']['input']>>;
  epoch_lt?: InputMaybe<Scalars['String']['input']>;
  epoch_lte?: InputMaybe<Scalars['String']['input']>;
  epoch_not?: InputMaybe<Scalars['String']['input']>;
  epoch_not_contains?: InputMaybe<Scalars['String']['input']>;
  epoch_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  epoch_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  epoch_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  epoch_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_starts_with?: InputMaybe<Scalars['String']['input']>;
  epoch_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WithdrawalClaim_Filter>>>;
  requests_?: InputMaybe<WithdrawalRequest_Filter>;
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
  user?: InputMaybe<Scalars['String']['input']>;
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
};

export enum WithdrawalClaim_OrderBy {
  AmountOut = 'amountOut',
  AssetOut = 'assetOut',
  AssetOutAddress = 'assetOut__address',
  AssetOutDecimals = 'assetOut__decimals',
  AssetOutId = 'assetOut__id',
  AssetOutLatestUsdPrice = 'assetOut__latestUSDPrice',
  AssetOutLatestUsdPriceTimestamp = 'assetOut__latestUSDPriceTimestamp',
  AssetOutName = 'assetOut__name',
  AssetOutSymbol = 'assetOut__symbol',
  BlockNumber = 'blockNumber',
  Epoch = 'epoch',
  EpochAggregateRoot = 'epoch__aggregateRoot',
  EpochAmountToBurnAtSettlement = 'epoch__amountToBurnAtSettlement',
  EpochAssetsReceived = 'epoch__assetsReceived',
  EpochClaimCount = 'epoch__claimCount',
  EpochEpoch = 'epoch__epoch',
  EpochId = 'epoch__id',
  EpochQueuedTimestamp = 'epoch__queuedTimestamp',
  EpochRequestCount = 'epoch__requestCount',
  EpochSettledTimestamp = 'epoch__settledTimestamp',
  EpochShareValueOfAssetsReceived = 'epoch__shareValueOfAssetsReceived',
  EpochSharesOwed = 'epoch__sharesOwed',
  EpochStatus = 'epoch__status',
  Id = 'id',
  Requests = 'requests',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenPercentApy = 'restakingToken__percentAPY',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD',
  Sender = 'sender',
  Timestamp = 'timestamp',
  Tx = 'tx',
  User = 'user',
  UserAddress = 'user__address',
  UserBalance = 'user__balance',
  UserId = 'user__id'
}

export type WithdrawalEpoch = {
  __typename?: 'WithdrawalEpoch';
  aggregateRoot?: Maybe<Scalars['Bytes']['output']>;
  amountToBurnAtSettlement: Scalars['BigDecimal']['output'];
  asset: Asset;
  assetsReceived: Scalars['BigDecimal']['output'];
  claimCount: Scalars['Int']['output'];
  claims?: Maybe<Array<WithdrawalClaim>>;
  epoch: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  queuedTimestamp?: Maybe<Scalars['BigInt']['output']>;
  requestCount: Scalars['Int']['output'];
  requests?: Maybe<Array<WithdrawalRequest>>;
  restakingToken: LiquidRestakingToken;
  settledTimestamp?: Maybe<Scalars['BigInt']['output']>;
  shareValueOfAssetsReceived: Scalars['BigDecimal']['output'];
  sharesOwed: Scalars['BigDecimal']['output'];
  status: WithdrawalEpochStatus;
};

export type WithdrawalEpochClaimsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalClaim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WithdrawalClaim_Filter>;
};

export type WithdrawalEpochRequestsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WithdrawalRequest_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WithdrawalRequest_Filter>;
};

export enum WithdrawalEpochStatus {
  Active = 'ACTIVE',
  Queued = 'QUEUED',
  Settled = 'SETTLED'
}

export type WithdrawalEpochUserSummary = {
  __typename?: 'WithdrawalEpochUserSummary';
  asset: Asset;
  epoch: WithdrawalEpoch;
  id: Scalars['ID']['output'];
  requestCount: Scalars['Int']['output'];
  user: User;
};

export type WithdrawalEpochUserSummary_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WithdrawalEpochUserSummary_Filter>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_?: InputMaybe<Asset_Filter>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch?: InputMaybe<Scalars['String']['input']>;
  epoch_?: InputMaybe<WithdrawalEpoch_Filter>;
  epoch_contains?: InputMaybe<Scalars['String']['input']>;
  epoch_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_ends_with?: InputMaybe<Scalars['String']['input']>;
  epoch_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_gt?: InputMaybe<Scalars['String']['input']>;
  epoch_gte?: InputMaybe<Scalars['String']['input']>;
  epoch_in?: InputMaybe<Array<Scalars['String']['input']>>;
  epoch_lt?: InputMaybe<Scalars['String']['input']>;
  epoch_lte?: InputMaybe<Scalars['String']['input']>;
  epoch_not?: InputMaybe<Scalars['String']['input']>;
  epoch_not_contains?: InputMaybe<Scalars['String']['input']>;
  epoch_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  epoch_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  epoch_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  epoch_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_starts_with?: InputMaybe<Scalars['String']['input']>;
  epoch_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WithdrawalEpochUserSummary_Filter>>>;
  requestCount?: InputMaybe<Scalars['Int']['input']>;
  requestCount_gt?: InputMaybe<Scalars['Int']['input']>;
  requestCount_gte?: InputMaybe<Scalars['Int']['input']>;
  requestCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  requestCount_lt?: InputMaybe<Scalars['Int']['input']>;
  requestCount_lte?: InputMaybe<Scalars['Int']['input']>;
  requestCount_not?: InputMaybe<Scalars['Int']['input']>;
  requestCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
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
};

export enum WithdrawalEpochUserSummary_OrderBy {
  Asset = 'asset',
  AssetAddress = 'asset__address',
  AssetDecimals = 'asset__decimals',
  AssetId = 'asset__id',
  AssetLatestUsdPrice = 'asset__latestUSDPrice',
  AssetLatestUsdPriceTimestamp = 'asset__latestUSDPriceTimestamp',
  AssetName = 'asset__name',
  AssetSymbol = 'asset__symbol',
  Epoch = 'epoch',
  EpochAggregateRoot = 'epoch__aggregateRoot',
  EpochAmountToBurnAtSettlement = 'epoch__amountToBurnAtSettlement',
  EpochAssetsReceived = 'epoch__assetsReceived',
  EpochClaimCount = 'epoch__claimCount',
  EpochEpoch = 'epoch__epoch',
  EpochId = 'epoch__id',
  EpochQueuedTimestamp = 'epoch__queuedTimestamp',
  EpochRequestCount = 'epoch__requestCount',
  EpochSettledTimestamp = 'epoch__settledTimestamp',
  EpochShareValueOfAssetsReceived = 'epoch__shareValueOfAssetsReceived',
  EpochSharesOwed = 'epoch__sharesOwed',
  EpochStatus = 'epoch__status',
  Id = 'id',
  RequestCount = 'requestCount',
  User = 'user',
  UserAddress = 'user__address',
  UserBalance = 'user__balance',
  UserId = 'user__id'
}

export type WithdrawalEpoch_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  aggregateRoot?: InputMaybe<Scalars['Bytes']['input']>;
  aggregateRoot_contains?: InputMaybe<Scalars['Bytes']['input']>;
  aggregateRoot_gt?: InputMaybe<Scalars['Bytes']['input']>;
  aggregateRoot_gte?: InputMaybe<Scalars['Bytes']['input']>;
  aggregateRoot_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  aggregateRoot_lt?: InputMaybe<Scalars['Bytes']['input']>;
  aggregateRoot_lte?: InputMaybe<Scalars['Bytes']['input']>;
  aggregateRoot_not?: InputMaybe<Scalars['Bytes']['input']>;
  aggregateRoot_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  aggregateRoot_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  amountToBurnAtSettlement?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToBurnAtSettlement_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToBurnAtSettlement_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToBurnAtSettlement_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  amountToBurnAtSettlement_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToBurnAtSettlement_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToBurnAtSettlement_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountToBurnAtSettlement_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  and?: InputMaybe<Array<InputMaybe<WithdrawalEpoch_Filter>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_?: InputMaybe<Asset_Filter>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetsReceived?: InputMaybe<Scalars['BigDecimal']['input']>;
  assetsReceived_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  assetsReceived_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  assetsReceived_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  assetsReceived_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  assetsReceived_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  assetsReceived_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  assetsReceived_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimCount?: InputMaybe<Scalars['Int']['input']>;
  claimCount_gt?: InputMaybe<Scalars['Int']['input']>;
  claimCount_gte?: InputMaybe<Scalars['Int']['input']>;
  claimCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  claimCount_lt?: InputMaybe<Scalars['Int']['input']>;
  claimCount_lte?: InputMaybe<Scalars['Int']['input']>;
  claimCount_not?: InputMaybe<Scalars['Int']['input']>;
  claimCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  claims_?: InputMaybe<WithdrawalClaim_Filter>;
  epoch?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  epoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WithdrawalEpoch_Filter>>>;
  queuedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  queuedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  requestCount?: InputMaybe<Scalars['Int']['input']>;
  requestCount_gt?: InputMaybe<Scalars['Int']['input']>;
  requestCount_gte?: InputMaybe<Scalars['Int']['input']>;
  requestCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  requestCount_lt?: InputMaybe<Scalars['Int']['input']>;
  requestCount_lte?: InputMaybe<Scalars['Int']['input']>;
  requestCount_not?: InputMaybe<Scalars['Int']['input']>;
  requestCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  requests_?: InputMaybe<WithdrawalRequest_Filter>;
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
  settledTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  settledTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  settledTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  settledTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  settledTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  settledTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  settledTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  settledTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  shareValueOfAssetsReceived?: InputMaybe<Scalars['BigDecimal']['input']>;
  shareValueOfAssetsReceived_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  shareValueOfAssetsReceived_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  shareValueOfAssetsReceived_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  shareValueOfAssetsReceived_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  shareValueOfAssetsReceived_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  shareValueOfAssetsReceived_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  shareValueOfAssetsReceived_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  sharesOwed?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sharesOwed_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  status?: InputMaybe<WithdrawalEpochStatus>;
  status_in?: InputMaybe<Array<WithdrawalEpochStatus>>;
  status_not?: InputMaybe<WithdrawalEpochStatus>;
  status_not_in?: InputMaybe<Array<WithdrawalEpochStatus>>;
};

export enum WithdrawalEpoch_OrderBy {
  AggregateRoot = 'aggregateRoot',
  AmountToBurnAtSettlement = 'amountToBurnAtSettlement',
  Asset = 'asset',
  AssetAddress = 'asset__address',
  AssetDecimals = 'asset__decimals',
  AssetId = 'asset__id',
  AssetLatestUsdPrice = 'asset__latestUSDPrice',
  AssetLatestUsdPriceTimestamp = 'asset__latestUSDPriceTimestamp',
  AssetName = 'asset__name',
  AssetSymbol = 'asset__symbol',
  AssetsReceived = 'assetsReceived',
  ClaimCount = 'claimCount',
  Claims = 'claims',
  Epoch = 'epoch',
  Id = 'id',
  QueuedTimestamp = 'queuedTimestamp',
  RequestCount = 'requestCount',
  Requests = 'requests',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenPercentApy = 'restakingToken__percentAPY',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD',
  SettledTimestamp = 'settledTimestamp',
  ShareValueOfAssetsReceived = 'shareValueOfAssetsReceived',
  SharesOwed = 'sharesOwed',
  Status = 'status'
}

export type WithdrawalQueue = {
  __typename?: 'WithdrawalQueue';
  address: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  restakingToken: LiquidRestakingToken;
};

export type WithdrawalQueue_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<WithdrawalQueue_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WithdrawalQueue_Filter>>>;
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

export enum WithdrawalQueue_OrderBy {
  Address = 'address',
  Id = 'id',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenPercentApy = 'restakingToken__percentAPY',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD'
}

export type WithdrawalRequest = {
  __typename?: 'WithdrawalRequest';
  amountIn: Scalars['BigDecimal']['output'];
  assetOut: Asset;
  blockNumber: Scalars['BigInt']['output'];
  claim?: Maybe<WithdrawalClaim>;
  epoch: WithdrawalEpoch;
  id: Scalars['ID']['output'];
  isClaimed: Scalars['Boolean']['output'];
  logIndex: Scalars['BigInt']['output'];
  restakingToken: LiquidRestakingToken;
  sender: Scalars['Bytes']['output'];
  sharesOwed: Scalars['BigDecimal']['output'];
  timestamp: Scalars['BigInt']['output'];
  tx: Scalars['Bytes']['output'];
  user: User;
  userBalanceAfter: Scalars['BigDecimal']['output'];
  userBalanceBefore: Scalars['BigDecimal']['output'];
  valueUSD?: Maybe<Scalars['BigDecimal']['output']>;
};

export type WithdrawalRequest_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<WithdrawalRequest_Filter>>>;
  assetOut?: InputMaybe<Scalars['String']['input']>;
  assetOut_?: InputMaybe<Asset_Filter>;
  assetOut_contains?: InputMaybe<Scalars['String']['input']>;
  assetOut_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetOut_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetOut_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetOut_gt?: InputMaybe<Scalars['String']['input']>;
  assetOut_gte?: InputMaybe<Scalars['String']['input']>;
  assetOut_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetOut_lt?: InputMaybe<Scalars['String']['input']>;
  assetOut_lte?: InputMaybe<Scalars['String']['input']>;
  assetOut_not?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_contains?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetOut_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetOut_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetOut_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetOut_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claim?: InputMaybe<Scalars['String']['input']>;
  claim_?: InputMaybe<WithdrawalClaim_Filter>;
  claim_contains?: InputMaybe<Scalars['String']['input']>;
  claim_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  claim_ends_with?: InputMaybe<Scalars['String']['input']>;
  claim_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  claim_gt?: InputMaybe<Scalars['String']['input']>;
  claim_gte?: InputMaybe<Scalars['String']['input']>;
  claim_in?: InputMaybe<Array<Scalars['String']['input']>>;
  claim_lt?: InputMaybe<Scalars['String']['input']>;
  claim_lte?: InputMaybe<Scalars['String']['input']>;
  claim_not?: InputMaybe<Scalars['String']['input']>;
  claim_not_contains?: InputMaybe<Scalars['String']['input']>;
  claim_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  claim_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  claim_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  claim_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  claim_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  claim_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  claim_starts_with?: InputMaybe<Scalars['String']['input']>;
  claim_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch?: InputMaybe<Scalars['String']['input']>;
  epoch_?: InputMaybe<WithdrawalEpoch_Filter>;
  epoch_contains?: InputMaybe<Scalars['String']['input']>;
  epoch_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_ends_with?: InputMaybe<Scalars['String']['input']>;
  epoch_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_gt?: InputMaybe<Scalars['String']['input']>;
  epoch_gte?: InputMaybe<Scalars['String']['input']>;
  epoch_in?: InputMaybe<Array<Scalars['String']['input']>>;
  epoch_lt?: InputMaybe<Scalars['String']['input']>;
  epoch_lte?: InputMaybe<Scalars['String']['input']>;
  epoch_not?: InputMaybe<Scalars['String']['input']>;
  epoch_not_contains?: InputMaybe<Scalars['String']['input']>;
  epoch_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  epoch_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  epoch_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  epoch_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  epoch_starts_with?: InputMaybe<Scalars['String']['input']>;
  epoch_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isClaimed?: InputMaybe<Scalars['Boolean']['input']>;
  isClaimed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isClaimed_not?: InputMaybe<Scalars['Boolean']['input']>;
  isClaimed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  logIndex?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WithdrawalRequest_Filter>>>;
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
  sharesOwed?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sharesOwed_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  sharesOwed_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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

export enum WithdrawalRequest_OrderBy {
  AmountIn = 'amountIn',
  AssetOut = 'assetOut',
  AssetOutAddress = 'assetOut__address',
  AssetOutDecimals = 'assetOut__decimals',
  AssetOutId = 'assetOut__id',
  AssetOutLatestUsdPrice = 'assetOut__latestUSDPrice',
  AssetOutLatestUsdPriceTimestamp = 'assetOut__latestUSDPriceTimestamp',
  AssetOutName = 'assetOut__name',
  AssetOutSymbol = 'assetOut__symbol',
  BlockNumber = 'blockNumber',
  Claim = 'claim',
  ClaimAmountOut = 'claim__amountOut',
  ClaimBlockNumber = 'claim__blockNumber',
  ClaimId = 'claim__id',
  ClaimSender = 'claim__sender',
  ClaimTimestamp = 'claim__timestamp',
  ClaimTx = 'claim__tx',
  Epoch = 'epoch',
  EpochAggregateRoot = 'epoch__aggregateRoot',
  EpochAmountToBurnAtSettlement = 'epoch__amountToBurnAtSettlement',
  EpochAssetsReceived = 'epoch__assetsReceived',
  EpochClaimCount = 'epoch__claimCount',
  EpochEpoch = 'epoch__epoch',
  EpochId = 'epoch__id',
  EpochQueuedTimestamp = 'epoch__queuedTimestamp',
  EpochRequestCount = 'epoch__requestCount',
  EpochSettledTimestamp = 'epoch__settledTimestamp',
  EpochShareValueOfAssetsReceived = 'epoch__shareValueOfAssetsReceived',
  EpochSharesOwed = 'epoch__sharesOwed',
  EpochStatus = 'epoch__status',
  Id = 'id',
  IsClaimed = 'isClaimed',
  LogIndex = 'logIndex',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenPercentApy = 'restakingToken__percentAPY',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD',
  Sender = 'sender',
  SharesOwed = 'sharesOwed',
  Timestamp = 'timestamp',
  Tx = 'tx',
  User = 'user',
  UserBalanceAfter = 'userBalanceAfter',
  UserBalanceBefore = 'userBalanceBefore',
  UserAddress = 'user__address',
  UserBalance = 'user__balance',
  UserId = 'user__id',
  ValueUsd = 'valueUSD'
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

export type LiquidRestakingTokenFieldsFragment = {
  __typename?: 'LiquidRestakingToken';
  id: string;
  address: any;
  symbol: string;
  name: string;
  createdTimestamp: any;
  totalSupply: any;
  coordinator: { __typename?: 'Coordinator'; id: string };
  underlyingAssets?: Array<{
    __typename?: 'UnderlyingAsset';
    address: any;
    strategy: any;
    priceFeed: any;
    depositCap: any;
    balance: any;
    asset: { __typename?: 'Asset'; symbol: string; name: string };
  }> | null;
};

export type DepositFieldsFragment = {
  __typename?: 'Deposit';
  id: string;
  sender: any;
  amountIn: any;
  amountOut: any;
  userBalanceAfter: any;
  timestamp: any;
  blockNumber: any;
  tx: any;
  assetIn: { __typename?: 'Asset'; id: string };
  restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
};

export type WithdrawalRequestFieldsFragment = {
  __typename?: 'WithdrawalRequest';
  id: string;
  sender: any;
  sharesOwed: any;
  amountIn: any;
  userBalanceAfter: any;
  timestamp: any;
  blockNumber: any;
  tx: any;
  isClaimed: boolean;
  epoch: {
    __typename?: 'WithdrawalEpoch';
    epoch: any;
    status: WithdrawalEpochStatus;
  };
  assetOut: { __typename?: 'Asset'; id: string };
  restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
  claim?: {
    __typename?: 'WithdrawalClaim';
    id: string;
    amountOut: any;
    tx: any;
  } | null;
};

export type WithdrawalClaimFieldsFragment = {
  __typename?: 'WithdrawalClaim';
  id: string;
  sender: any;
  amountOut: any;
  timestamp: any;
  blockNumber: any;
  tx: any;
  epoch: { __typename?: 'WithdrawalEpoch'; epoch: any };
  assetOut: { __typename?: 'Asset'; id: string };
  restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
  requests?: Array<{ __typename?: 'WithdrawalRequest'; id: string }> | null;
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
    createdTimestamp: any;
    totalSupply: any;
    coordinator: { __typename?: 'Coordinator'; id: string };
    underlyingAssets?: Array<{
      __typename?: 'UnderlyingAsset';
      address: any;
      strategy: any;
      priceFeed: any;
      depositCap: any;
      balance: any;
      asset: { __typename?: 'Asset'; symbol: string; name: string };
    }> | null;
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
    createdTimestamp: any;
    totalSupply: any;
    coordinator: { __typename?: 'Coordinator'; id: string };
    underlyingAssets?: Array<{
      __typename?: 'UnderlyingAsset';
      address: any;
      strategy: any;
      priceFeed: any;
      depositCap: any;
      balance: any;
      asset: { __typename?: 'Asset'; symbol: string; name: string };
    }> | null;
  }>;
};

export type ManyDepositsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Deposit_Filter>;
}>;

export type ManyDepositsQuery = {
  __typename?: 'Query';
  deposits: Array<{
    __typename?: 'Deposit';
    id: string;
    sender: any;
    amountIn: any;
    amountOut: any;
    userBalanceAfter: any;
    timestamp: any;
    blockNumber: any;
    tx: any;
    assetIn: { __typename?: 'Asset'; id: string };
    restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
  }>;
};

export type ManyWithdrawalRequestsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy?: InputMaybe<WithdrawalRequest_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<WithdrawalRequest_Filter>;
}>;

export type ManyWithdrawalRequestsQuery = {
  __typename?: 'Query';
  withdrawalRequests: Array<{
    __typename?: 'WithdrawalRequest';
    id: string;
    sender: any;
    sharesOwed: any;
    amountIn: any;
    userBalanceAfter: any;
    timestamp: any;
    blockNumber: any;
    tx: any;
    isClaimed: boolean;
    epoch: {
      __typename?: 'WithdrawalEpoch';
      epoch: any;
      status: WithdrawalEpochStatus;
    };
    assetOut: { __typename?: 'Asset'; id: string };
    restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
    claim?: {
      __typename?: 'WithdrawalClaim';
      id: string;
      amountOut: any;
      tx: any;
    } | null;
  }>;
};

export type ManyWithdrawalClaimsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy?: InputMaybe<WithdrawalClaim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<WithdrawalClaim_Filter>;
}>;

export type ManyWithdrawalClaimsQuery = {
  __typename?: 'Query';
  withdrawalClaims: Array<{
    __typename?: 'WithdrawalClaim';
    id: string;
    sender: any;
    amountOut: any;
    timestamp: any;
    blockNumber: any;
    tx: any;
    epoch: { __typename?: 'WithdrawalEpoch'; epoch: any };
    assetOut: { __typename?: 'Asset'; id: string };
    restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
    requests?: Array<{ __typename?: 'WithdrawalRequest'; id: string }> | null;
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
            name: { kind: 'Name', value: 'coordinator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'underlyingAssets' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'asset' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'symbol' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'strategy' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceFeed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'depositCap' } },
                { kind: 'Field', name: { kind: 'Name', value: 'balance' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<LiquidRestakingTokenFieldsFragment, unknown>;
export const DepositFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DepositFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Deposit' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sender' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assetIn' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'amountIn' } },
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
} as unknown as DocumentNode<DepositFieldsFragment, unknown>;
export const WithdrawalRequestFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WithdrawalRequestFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'WithdrawalRequest' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sender' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'epoch' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'epoch' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assetOut' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
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
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isClaimed' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'claim' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountOut' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<WithdrawalRequestFieldsFragment, unknown>;
export const WithdrawalClaimFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WithdrawalClaimFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'WithdrawalClaim' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sender' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'epoch' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'epoch' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assetOut' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'requests' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<WithdrawalClaimFieldsFragment, unknown>;
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
            name: { kind: 'Name', value: 'coordinator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'underlyingAssets' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'asset' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'symbol' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'strategy' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceFeed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'depositCap' } },
                { kind: 'Field', name: { kind: 'Name', value: 'balance' } }
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
            name: { kind: 'Name', value: 'coordinator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'underlyingAssets' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'asset' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'symbol' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'strategy' } },
                { kind: 'Field', name: { kind: 'Name', value: 'priceFeed' } },
                { kind: 'Field', name: { kind: 'Name', value: 'depositCap' } },
                { kind: 'Field', name: { kind: 'Name', value: 'balance' } }
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
export const ManyDepositsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manyDeposits' },
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
            name: { kind: 'Name', value: 'Deposit_orderBy' }
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
            name: { kind: 'Name', value: 'Deposit_filter' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deposits' },
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
                  name: { kind: 'Name', value: 'DepositFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DepositFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Deposit' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sender' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assetIn' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'amountIn' } },
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
} as unknown as DocumentNode<ManyDepositsQuery, ManyDepositsQueryVariables>;
export const ManyWithdrawalRequestsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manyWithdrawalRequests' },
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
            name: { kind: 'Name', value: 'WithdrawalRequest_orderBy' }
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
            name: { kind: 'Name', value: 'WithdrawalRequest_filter' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'withdrawalRequests' },
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
                  name: { kind: 'Name', value: 'WithdrawalRequestFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WithdrawalRequestFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'WithdrawalRequest' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sender' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'epoch' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'epoch' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assetOut' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
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
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isClaimed' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'claim' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountOut' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  ManyWithdrawalRequestsQuery,
  ManyWithdrawalRequestsQueryVariables
>;
export const ManyWithdrawalClaimsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manyWithdrawalClaims' },
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
            name: { kind: 'Name', value: 'WithdrawalClaim_orderBy' }
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
            name: { kind: 'Name', value: 'WithdrawalClaim_filter' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'withdrawalClaims' },
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
                  name: { kind: 'Name', value: 'WithdrawalClaimFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WithdrawalClaimFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'WithdrawalClaim' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sender' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'epoch' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'epoch' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assetOut' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'requests' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  ManyWithdrawalClaimsQuery,
  ManyWithdrawalClaimsQueryVariables
>;
