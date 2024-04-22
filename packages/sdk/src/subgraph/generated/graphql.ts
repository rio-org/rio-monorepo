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

export type AvsRegistry = {
  __typename?: 'AVSRegistry';
  address: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  restakingToken: LiquidRestakingToken;
};

export type AvsRegistry_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<AvsRegistry_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AvsRegistry_Filter>>>;
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

export enum AvsRegistry_OrderBy {
  Address = 'address',
  Id = 'id',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD'
}

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

export type AssetRegistry = {
  __typename?: 'AssetRegistry';
  address: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  restakingToken: LiquidRestakingToken;
};

export type AssetRegistry_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<AssetRegistry_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AssetRegistry_Filter>>>;
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

export enum AssetRegistry_OrderBy {
  Address = 'address',
  Id = 'id',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD'
}

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
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
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
  restakingTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  sender: Scalars['Bytes']['output'];
  timestamp: Scalars['BigInt']['output'];
  tx: Scalars['Bytes']['output'];
  user: User;
  userBalanceAfter: Scalars['BigDecimal']['output'];
  userBalanceBefore: Scalars['BigDecimal']['output'];
  valueUSD?: Maybe<Scalars['BigDecimal']['output']>;
};

export type DepositPool = {
  __typename?: 'DepositPool';
  address: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  restakingToken: LiquidRestakingToken;
};

export type DepositPool_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<DepositPool_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DepositPool_Filter>>>;
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

export enum DepositPool_OrderBy {
  Address = 'address',
  Id = 'id',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD'
}

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
  restakingTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  restakingTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
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
  RestakingTokenPriceUsd = 'restakingTokenPriceUSD',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
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
  assetRegistry: AssetRegistry;
  avsRegistry: AvsRegistry;
  coordinator: Coordinator;
  createdTimestamp: Scalars['BigInt']['output'];
  depositPool: DepositPool;
  exchangeRateETH?: Maybe<Scalars['BigDecimal']['output']>;
  exchangeRateUSD?: Maybe<Scalars['BigDecimal']['output']>;
  id: Scalars['ID']['output'];
  issuer: Issuer;
  name: Scalars['String']['output'];
  operatorRegistry: OperatorRegistry;
  priceFeeds?: Maybe<Array<PriceFeed>>;
  rewardDistributor: RewardDistributor;
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['BigDecimal']['output'];
  totalValueETH?: Maybe<Scalars['BigDecimal']['output']>;
  totalValueUSD?: Maybe<Scalars['BigDecimal']['output']>;
  underlyingAssets?: Maybe<Array<UnderlyingAsset>>;
  withdrawalQueue: WithdrawalQueue;
};

export type LiquidRestakingTokenPriceFeedsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PriceFeed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PriceFeed_Filter>;
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
  assetRegistry_?: InputMaybe<AssetRegistry_Filter>;
  avsRegistry_?: InputMaybe<AvsRegistry_Filter>;
  coordinator_?: InputMaybe<Coordinator_Filter>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositPool_?: InputMaybe<DepositPool_Filter>;
  exchangeRateETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  exchangeRateETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  exchangeRateUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  exchangeRateUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  exchangeRateUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  operatorRegistry_?: InputMaybe<OperatorRegistry_Filter>;
  or?: InputMaybe<Array<InputMaybe<LiquidRestakingToken_Filter>>>;
  priceFeeds_?: InputMaybe<PriceFeed_Filter>;
  rewardDistributor_?: InputMaybe<RewardDistributor_Filter>;
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
  withdrawalQueue_?: InputMaybe<WithdrawalQueue_Filter>;
};

export enum LiquidRestakingToken_OrderBy {
  Address = 'address',
  AssetRegistry = 'assetRegistry',
  AssetRegistryAddress = 'assetRegistry__address',
  AssetRegistryId = 'assetRegistry__id',
  AvsRegistry = 'avsRegistry',
  AvsRegistryAddress = 'avsRegistry__address',
  AvsRegistryId = 'avsRegistry__id',
  Coordinator = 'coordinator',
  CoordinatorAddress = 'coordinator__address',
  CoordinatorId = 'coordinator__id',
  CreatedTimestamp = 'createdTimestamp',
  DepositPool = 'depositPool',
  DepositPoolAddress = 'depositPool__address',
  DepositPoolId = 'depositPool__id',
  ExchangeRateEth = 'exchangeRateETH',
  ExchangeRateUsd = 'exchangeRateUSD',
  Id = 'id',
  Issuer = 'issuer',
  IssuerAddress = 'issuer__address',
  IssuerId = 'issuer__id',
  IssuerTokensIssued = 'issuer__tokensIssued',
  Name = 'name',
  OperatorRegistry = 'operatorRegistry',
  OperatorRegistryAddress = 'operatorRegistry__address',
  OperatorRegistryId = 'operatorRegistry__id',
  PriceFeeds = 'priceFeeds',
  RewardDistributor = 'rewardDistributor',
  RewardDistributorAddress = 'rewardDistributor__address',
  RewardDistributorId = 'rewardDistributor__id',
  Symbol = 'symbol',
  TotalSupply = 'totalSupply',
  TotalValueEth = 'totalValueETH',
  TotalValueUsd = 'totalValueUSD',
  UnderlyingAssets = 'underlyingAssets',
  WithdrawalQueue = 'withdrawalQueue',
  WithdrawalQueueAddress = 'withdrawalQueue__address',
  WithdrawalQueueId = 'withdrawalQueue__id'
}

export type Operator = {
  __typename?: 'Operator';
  address: Scalars['Bytes']['output'];
  delegationApprover?: Maybe<Scalars['Bytes']['output']>;
  delegator: OperatorDelegator;
  id: Scalars['ID']['output'];
  metadata?: Maybe<OperatorMetadata>;
  metadataURI: Scalars['String']['output'];
  stakerOptOutWindowBlocks?: Maybe<Scalars['BigInt']['output']>;
};

export type OperatorDelegator = {
  __typename?: 'OperatorDelegator';
  address: Scalars['Bytes']['output'];
  delegatorId: Scalars['Int']['output'];
  depositedValidatorKeyCount: Scalars['BigInt']['output'];
  earningsReceiver: Scalars['Bytes']['output'];
  eigenPod: Scalars['Bytes']['output'];
  exitedValidatorKeyCount: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  manager: Scalars['Bytes']['output'];
  operator: Operator;
  restakingToken: LiquidRestakingToken;
  totalValidatorKeyCount: Scalars['BigInt']['output'];
  unusedValidatorKeyCount: Scalars['BigInt']['output'];
  validators?: Maybe<Array<Validator>>;
};

export type OperatorDelegatorValidatorsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Validator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Validator_Filter>;
};

export type OperatorDelegator_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<OperatorDelegator_Filter>>>;
  delegatorId?: InputMaybe<Scalars['Int']['input']>;
  delegatorId_gt?: InputMaybe<Scalars['Int']['input']>;
  delegatorId_gte?: InputMaybe<Scalars['Int']['input']>;
  delegatorId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  delegatorId_lt?: InputMaybe<Scalars['Int']['input']>;
  delegatorId_lte?: InputMaybe<Scalars['Int']['input']>;
  delegatorId_not?: InputMaybe<Scalars['Int']['input']>;
  delegatorId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  depositedValidatorKeyCount?: InputMaybe<Scalars['BigInt']['input']>;
  depositedValidatorKeyCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedValidatorKeyCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedValidatorKeyCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedValidatorKeyCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedValidatorKeyCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedValidatorKeyCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedValidatorKeyCount_not_in?: InputMaybe<
    Array<Scalars['BigInt']['input']>
  >;
  earningsReceiver?: InputMaybe<Scalars['Bytes']['input']>;
  earningsReceiver_contains?: InputMaybe<Scalars['Bytes']['input']>;
  earningsReceiver_gt?: InputMaybe<Scalars['Bytes']['input']>;
  earningsReceiver_gte?: InputMaybe<Scalars['Bytes']['input']>;
  earningsReceiver_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  earningsReceiver_lt?: InputMaybe<Scalars['Bytes']['input']>;
  earningsReceiver_lte?: InputMaybe<Scalars['Bytes']['input']>;
  earningsReceiver_not?: InputMaybe<Scalars['Bytes']['input']>;
  earningsReceiver_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  earningsReceiver_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  eigenPod?: InputMaybe<Scalars['Bytes']['input']>;
  eigenPod_contains?: InputMaybe<Scalars['Bytes']['input']>;
  eigenPod_gt?: InputMaybe<Scalars['Bytes']['input']>;
  eigenPod_gte?: InputMaybe<Scalars['Bytes']['input']>;
  eigenPod_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  eigenPod_lt?: InputMaybe<Scalars['Bytes']['input']>;
  eigenPod_lte?: InputMaybe<Scalars['Bytes']['input']>;
  eigenPod_not?: InputMaybe<Scalars['Bytes']['input']>;
  eigenPod_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  eigenPod_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  exitedValidatorKeyCount?: InputMaybe<Scalars['BigInt']['input']>;
  exitedValidatorKeyCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  exitedValidatorKeyCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  exitedValidatorKeyCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exitedValidatorKeyCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  exitedValidatorKeyCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  exitedValidatorKeyCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  exitedValidatorKeyCount_not_in?: InputMaybe<
    Array<Scalars['BigInt']['input']>
  >;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  manager?: InputMaybe<Scalars['Bytes']['input']>;
  manager_contains?: InputMaybe<Scalars['Bytes']['input']>;
  manager_gt?: InputMaybe<Scalars['Bytes']['input']>;
  manager_gte?: InputMaybe<Scalars['Bytes']['input']>;
  manager_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  manager_lt?: InputMaybe<Scalars['Bytes']['input']>;
  manager_lte?: InputMaybe<Scalars['Bytes']['input']>;
  manager_not?: InputMaybe<Scalars['Bytes']['input']>;
  manager_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  manager_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  operator?: InputMaybe<Scalars['String']['input']>;
  operator_?: InputMaybe<Operator_Filter>;
  operator_contains?: InputMaybe<Scalars['String']['input']>;
  operator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_gt?: InputMaybe<Scalars['String']['input']>;
  operator_gte?: InputMaybe<Scalars['String']['input']>;
  operator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_lt?: InputMaybe<Scalars['String']['input']>;
  operator_lte?: InputMaybe<Scalars['String']['input']>;
  operator_not?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains?: InputMaybe<Scalars['String']['input']>;
  operator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  operator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with?: InputMaybe<Scalars['String']['input']>;
  operator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<OperatorDelegator_Filter>>>;
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
  totalValidatorKeyCount?: InputMaybe<Scalars['BigInt']['input']>;
  totalValidatorKeyCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValidatorKeyCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValidatorKeyCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValidatorKeyCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalValidatorKeyCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalValidatorKeyCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalValidatorKeyCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unusedValidatorKeyCount?: InputMaybe<Scalars['BigInt']['input']>;
  unusedValidatorKeyCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unusedValidatorKeyCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unusedValidatorKeyCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unusedValidatorKeyCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unusedValidatorKeyCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unusedValidatorKeyCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  unusedValidatorKeyCount_not_in?: InputMaybe<
    Array<Scalars['BigInt']['input']>
  >;
  validators_?: InputMaybe<Validator_Filter>;
};

export enum OperatorDelegator_OrderBy {
  Address = 'address',
  DelegatorId = 'delegatorId',
  DepositedValidatorKeyCount = 'depositedValidatorKeyCount',
  EarningsReceiver = 'earningsReceiver',
  EigenPod = 'eigenPod',
  ExitedValidatorKeyCount = 'exitedValidatorKeyCount',
  Id = 'id',
  Manager = 'manager',
  Operator = 'operator',
  OperatorAddress = 'operator__address',
  OperatorDelegationApprover = 'operator__delegationApprover',
  OperatorId = 'operator__id',
  OperatorMetadataUri = 'operator__metadataURI',
  OperatorStakerOptOutWindowBlocks = 'operator__stakerOptOutWindowBlocks',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD',
  TotalValidatorKeyCount = 'totalValidatorKeyCount',
  UnusedValidatorKeyCount = 'unusedValidatorKeyCount',
  Validators = 'validators'
}

export type OperatorMetadata = {
  __typename?: 'OperatorMetadata';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  twitter?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type OperatorMetadata_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OperatorMetadata_Filter>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logo?: InputMaybe<Scalars['String']['input']>;
  logo_contains?: InputMaybe<Scalars['String']['input']>;
  logo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  logo_ends_with?: InputMaybe<Scalars['String']['input']>;
  logo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  logo_gt?: InputMaybe<Scalars['String']['input']>;
  logo_gte?: InputMaybe<Scalars['String']['input']>;
  logo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  logo_lt?: InputMaybe<Scalars['String']['input']>;
  logo_lte?: InputMaybe<Scalars['String']['input']>;
  logo_not?: InputMaybe<Scalars['String']['input']>;
  logo_not_contains?: InputMaybe<Scalars['String']['input']>;
  logo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  logo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  logo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  logo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  logo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  logo_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  logo_starts_with?: InputMaybe<Scalars['String']['input']>;
  logo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  or?: InputMaybe<Array<InputMaybe<OperatorMetadata_Filter>>>;
  twitter?: InputMaybe<Scalars['String']['input']>;
  twitter_contains?: InputMaybe<Scalars['String']['input']>;
  twitter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  twitter_ends_with?: InputMaybe<Scalars['String']['input']>;
  twitter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  twitter_gt?: InputMaybe<Scalars['String']['input']>;
  twitter_gte?: InputMaybe<Scalars['String']['input']>;
  twitter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  twitter_lt?: InputMaybe<Scalars['String']['input']>;
  twitter_lte?: InputMaybe<Scalars['String']['input']>;
  twitter_not?: InputMaybe<Scalars['String']['input']>;
  twitter_not_contains?: InputMaybe<Scalars['String']['input']>;
  twitter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  twitter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  twitter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  twitter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  twitter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  twitter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  twitter_starts_with?: InputMaybe<Scalars['String']['input']>;
  twitter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  website_contains?: InputMaybe<Scalars['String']['input']>;
  website_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  website_ends_with?: InputMaybe<Scalars['String']['input']>;
  website_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  website_gt?: InputMaybe<Scalars['String']['input']>;
  website_gte?: InputMaybe<Scalars['String']['input']>;
  website_in?: InputMaybe<Array<Scalars['String']['input']>>;
  website_lt?: InputMaybe<Scalars['String']['input']>;
  website_lte?: InputMaybe<Scalars['String']['input']>;
  website_not?: InputMaybe<Scalars['String']['input']>;
  website_not_contains?: InputMaybe<Scalars['String']['input']>;
  website_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  website_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  website_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  website_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  website_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  website_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  website_starts_with?: InputMaybe<Scalars['String']['input']>;
  website_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum OperatorMetadata_OrderBy {
  Description = 'description',
  Id = 'id',
  Logo = 'logo',
  Name = 'name',
  Twitter = 'twitter',
  Website = 'website'
}

export type OperatorRegistry = {
  __typename?: 'OperatorRegistry';
  address: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  restakingToken: LiquidRestakingToken;
};

export type OperatorRegistry_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<OperatorRegistry_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<OperatorRegistry_Filter>>>;
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

export enum OperatorRegistry_OrderBy {
  Address = 'address',
  Id = 'id',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD'
}

export type Operator_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<Operator_Filter>>>;
  delegationApprover?: InputMaybe<Scalars['Bytes']['input']>;
  delegationApprover_contains?: InputMaybe<Scalars['Bytes']['input']>;
  delegationApprover_gt?: InputMaybe<Scalars['Bytes']['input']>;
  delegationApprover_gte?: InputMaybe<Scalars['Bytes']['input']>;
  delegationApprover_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  delegationApprover_lt?: InputMaybe<Scalars['Bytes']['input']>;
  delegationApprover_lte?: InputMaybe<Scalars['Bytes']['input']>;
  delegationApprover_not?: InputMaybe<Scalars['Bytes']['input']>;
  delegationApprover_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  delegationApprover_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  delegator_?: InputMaybe<OperatorDelegator_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  metadata?: InputMaybe<Scalars['String']['input']>;
  metadataURI?: InputMaybe<Scalars['String']['input']>;
  metadataURI_contains?: InputMaybe<Scalars['String']['input']>;
  metadataURI_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataURI_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataURI_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataURI_gt?: InputMaybe<Scalars['String']['input']>;
  metadataURI_gte?: InputMaybe<Scalars['String']['input']>;
  metadataURI_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataURI_lt?: InputMaybe<Scalars['String']['input']>;
  metadataURI_lte?: InputMaybe<Scalars['String']['input']>;
  metadataURI_not?: InputMaybe<Scalars['String']['input']>;
  metadataURI_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadataURI_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataURI_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataURI_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataURI_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataURI_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataURI_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataURI_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataURI_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_?: InputMaybe<OperatorMetadata_Filter>;
  metadata_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_gt?: InputMaybe<Scalars['String']['input']>;
  metadata_gte?: InputMaybe<Scalars['String']['input']>;
  metadata_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_lt?: InputMaybe<Scalars['String']['input']>;
  metadata_lte?: InputMaybe<Scalars['String']['input']>;
  metadata_not?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadata_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Operator_Filter>>>;
  stakerOptOutWindowBlocks?: InputMaybe<Scalars['BigInt']['input']>;
  stakerOptOutWindowBlocks_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakerOptOutWindowBlocks_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakerOptOutWindowBlocks_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakerOptOutWindowBlocks_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakerOptOutWindowBlocks_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakerOptOutWindowBlocks_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakerOptOutWindowBlocks_not_in?: InputMaybe<
    Array<Scalars['BigInt']['input']>
  >;
};

export enum Operator_OrderBy {
  Address = 'address',
  DelegationApprover = 'delegationApprover',
  Delegator = 'delegator',
  DelegatorAddress = 'delegator__address',
  DelegatorDelegatorId = 'delegator__delegatorId',
  DelegatorDepositedValidatorKeyCount = 'delegator__depositedValidatorKeyCount',
  DelegatorEarningsReceiver = 'delegator__earningsReceiver',
  DelegatorEigenPod = 'delegator__eigenPod',
  DelegatorExitedValidatorKeyCount = 'delegator__exitedValidatorKeyCount',
  DelegatorId = 'delegator__id',
  DelegatorManager = 'delegator__manager',
  DelegatorTotalValidatorKeyCount = 'delegator__totalValidatorKeyCount',
  DelegatorUnusedValidatorKeyCount = 'delegator__unusedValidatorKeyCount',
  Id = 'id',
  Metadata = 'metadata',
  MetadataUri = 'metadataURI',
  MetadataDescription = 'metadata__description',
  MetadataId = 'metadata__id',
  MetadataLogo = 'metadata__logo',
  MetadataName = 'metadata__name',
  MetadataTwitter = 'metadata__twitter',
  MetadataWebsite = 'metadata__website',
  StakerOptOutWindowBlocks = 'stakerOptOutWindowBlocks'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PriceFeed = {
  __typename?: 'PriceFeed';
  address: Scalars['Bytes']['output'];
  assetPair: Scalars['String']['output'];
  baseAsset: Asset;
  decimals: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  feedType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastUpdatedTimestamp?: Maybe<Scalars['BigInt']['output']>;
  price?: Maybe<Scalars['BigDecimal']['output']>;
  priceSource?: Maybe<PriceSource>;
  quoteAssetSymbol: Scalars['String']['output'];
  usedBy: Array<LiquidRestakingToken>;
};

export type PriceFeedUsedByArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidRestakingToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LiquidRestakingToken_Filter>;
};

export type PriceFeed_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<PriceFeed_Filter>>>;
  assetPair?: InputMaybe<Scalars['String']['input']>;
  assetPair_contains?: InputMaybe<Scalars['String']['input']>;
  assetPair_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetPair_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetPair_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetPair_gt?: InputMaybe<Scalars['String']['input']>;
  assetPair_gte?: InputMaybe<Scalars['String']['input']>;
  assetPair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetPair_lt?: InputMaybe<Scalars['String']['input']>;
  assetPair_lte?: InputMaybe<Scalars['String']['input']>;
  assetPair_not?: InputMaybe<Scalars['String']['input']>;
  assetPair_not_contains?: InputMaybe<Scalars['String']['input']>;
  assetPair_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  assetPair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  assetPair_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetPair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  assetPair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetPair_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  assetPair_starts_with?: InputMaybe<Scalars['String']['input']>;
  assetPair_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  baseAsset?: InputMaybe<Scalars['String']['input']>;
  baseAsset_?: InputMaybe<Asset_Filter>;
  baseAsset_contains?: InputMaybe<Scalars['String']['input']>;
  baseAsset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  baseAsset_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseAsset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  baseAsset_gt?: InputMaybe<Scalars['String']['input']>;
  baseAsset_gte?: InputMaybe<Scalars['String']['input']>;
  baseAsset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseAsset_lt?: InputMaybe<Scalars['String']['input']>;
  baseAsset_lte?: InputMaybe<Scalars['String']['input']>;
  baseAsset_not?: InputMaybe<Scalars['String']['input']>;
  baseAsset_not_contains?: InputMaybe<Scalars['String']['input']>;
  baseAsset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  baseAsset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  baseAsset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  baseAsset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  baseAsset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseAsset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  baseAsset_starts_with?: InputMaybe<Scalars['String']['input']>;
  baseAsset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feedType?: InputMaybe<Scalars['String']['input']>;
  feedType_contains?: InputMaybe<Scalars['String']['input']>;
  feedType_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  feedType_ends_with?: InputMaybe<Scalars['String']['input']>;
  feedType_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feedType_gt?: InputMaybe<Scalars['String']['input']>;
  feedType_gte?: InputMaybe<Scalars['String']['input']>;
  feedType_in?: InputMaybe<Array<Scalars['String']['input']>>;
  feedType_lt?: InputMaybe<Scalars['String']['input']>;
  feedType_lte?: InputMaybe<Scalars['String']['input']>;
  feedType_not?: InputMaybe<Scalars['String']['input']>;
  feedType_not_contains?: InputMaybe<Scalars['String']['input']>;
  feedType_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  feedType_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  feedType_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feedType_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  feedType_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  feedType_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feedType_starts_with?: InputMaybe<Scalars['String']['input']>;
  feedType_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastUpdatedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdatedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PriceFeed_Filter>>>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceSource_?: InputMaybe<PriceSource_Filter>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  quoteAssetSymbol?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_contains?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_gt?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_gte?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteAssetSymbol_lt?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_lte?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_not?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_not_ends_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  quoteAssetSymbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  quoteAssetSymbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  quoteAssetSymbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  quoteAssetSymbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  usedBy?: InputMaybe<Array<Scalars['String']['input']>>;
  usedBy_?: InputMaybe<LiquidRestakingToken_Filter>;
  usedBy_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  usedBy_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  usedBy_not?: InputMaybe<Array<Scalars['String']['input']>>;
  usedBy_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  usedBy_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum PriceFeed_OrderBy {
  Address = 'address',
  AssetPair = 'assetPair',
  BaseAsset = 'baseAsset',
  BaseAssetAddress = 'baseAsset__address',
  BaseAssetDecimals = 'baseAsset__decimals',
  BaseAssetId = 'baseAsset__id',
  BaseAssetLatestUsdPrice = 'baseAsset__latestUSDPrice',
  BaseAssetLatestUsdPriceTimestamp = 'baseAsset__latestUSDPriceTimestamp',
  BaseAssetName = 'baseAsset__name',
  BaseAssetSymbol = 'baseAsset__symbol',
  Decimals = 'decimals',
  Description = 'description',
  FeedType = 'feedType',
  Id = 'id',
  LastUpdatedTimestamp = 'lastUpdatedTimestamp',
  Price = 'price',
  PriceSource = 'priceSource',
  PriceSourceAddress = 'priceSource__address',
  PriceSourceId = 'priceSource__id',
  QuoteAssetSymbol = 'quoteAssetSymbol',
  UsedBy = 'usedBy'
}

export type PriceSource = {
  __typename?: 'PriceSource';
  address: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  priceFeed: PriceFeed;
};

export type PriceSource_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<PriceSource_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PriceSource_Filter>>>;
  priceFeed?: InputMaybe<Scalars['String']['input']>;
  priceFeed_?: InputMaybe<PriceFeed_Filter>;
  priceFeed_contains?: InputMaybe<Scalars['String']['input']>;
  priceFeed_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  priceFeed_ends_with?: InputMaybe<Scalars['String']['input']>;
  priceFeed_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceFeed_gt?: InputMaybe<Scalars['String']['input']>;
  priceFeed_gte?: InputMaybe<Scalars['String']['input']>;
  priceFeed_in?: InputMaybe<Array<Scalars['String']['input']>>;
  priceFeed_lt?: InputMaybe<Scalars['String']['input']>;
  priceFeed_lte?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_contains?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  priceFeed_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceFeed_starts_with?: InputMaybe<Scalars['String']['input']>;
  priceFeed_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum PriceSource_OrderBy {
  Address = 'address',
  Id = 'id',
  PriceFeed = 'priceFeed',
  PriceFeedAddress = 'priceFeed__address',
  PriceFeedAssetPair = 'priceFeed__assetPair',
  PriceFeedDecimals = 'priceFeed__decimals',
  PriceFeedDescription = 'priceFeed__description',
  PriceFeedFeedType = 'priceFeed__feedType',
  PriceFeedId = 'priceFeed__id',
  PriceFeedLastUpdatedTimestamp = 'priceFeed__lastUpdatedTimestamp',
  PriceFeedPrice = 'priceFeed__price',
  PriceFeedQuoteAssetSymbol = 'priceFeed__quoteAssetSymbol'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  asset?: Maybe<Asset>;
  assetRegistries: Array<AssetRegistry>;
  assetRegistry?: Maybe<AssetRegistry>;
  assets: Array<Asset>;
  avsregistries: Array<AvsRegistry>;
  avsregistry?: Maybe<AvsRegistry>;
  coordinator?: Maybe<Coordinator>;
  coordinators: Array<Coordinator>;
  deposit?: Maybe<Deposit>;
  depositPool?: Maybe<DepositPool>;
  depositPools: Array<DepositPool>;
  deposits: Array<Deposit>;
  issuer?: Maybe<Issuer>;
  issuers: Array<Issuer>;
  liquidRestakingToken?: Maybe<LiquidRestakingToken>;
  liquidRestakingTokens: Array<LiquidRestakingToken>;
  operator?: Maybe<Operator>;
  operatorDelegator?: Maybe<OperatorDelegator>;
  operatorDelegators: Array<OperatorDelegator>;
  operatorMetadata: Array<OperatorMetadata>;
  operatorRegistries: Array<OperatorRegistry>;
  operatorRegistry?: Maybe<OperatorRegistry>;
  operators: Array<Operator>;
  priceFeed?: Maybe<PriceFeed>;
  priceFeeds: Array<PriceFeed>;
  priceSource?: Maybe<PriceSource>;
  priceSources: Array<PriceSource>;
  rewardDistributor?: Maybe<RewardDistributor>;
  rewardDistributors: Array<RewardDistributor>;
  tokenTransfer?: Maybe<TokenTransfer>;
  tokenTransfers: Array<TokenTransfer>;
  underlyingAsset?: Maybe<UnderlyingAsset>;
  underlyingAssets: Array<UnderlyingAsset>;
  user?: Maybe<User>;
  users: Array<User>;
  validator?: Maybe<Validator>;
  validatorKeyIndex?: Maybe<ValidatorKeyIndex>;
  validatorKeyIndexes: Array<ValidatorKeyIndex>;
  validators: Array<Validator>;
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

export type QueryAssetRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AssetRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AssetRegistry_Filter>;
};

export type QueryAssetRegistryArgs = {
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

export type QueryAvsregistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AvsRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AvsRegistry_Filter>;
};

export type QueryAvsregistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
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

export type QueryDepositPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDepositPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DepositPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DepositPool_Filter>;
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

export type QueryOperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOperatorDelegatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOperatorDelegatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorDelegator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OperatorDelegator_Filter>;
};

export type QueryOperatorMetadataArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorMetadata_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OperatorMetadata_Filter>;
};

export type QueryOperatorRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OperatorRegistry_Filter>;
};

export type QueryOperatorRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Operator_Filter>;
};

export type QueryPriceFeedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPriceFeedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PriceFeed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PriceFeed_Filter>;
};

export type QueryPriceSourceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPriceSourcesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PriceSource_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PriceSource_Filter>;
};

export type QueryRewardDistributorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRewardDistributorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardDistributor_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardDistributor_Filter>;
};

export type QueryTokenTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenTransfer_Filter>;
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

export type QueryValidatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryValidatorKeyIndexArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryValidatorKeyIndexesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ValidatorKeyIndex_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ValidatorKeyIndex_Filter>;
};

export type QueryValidatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Validator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Validator_Filter>;
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

export type RewardDistributor = {
  __typename?: 'RewardDistributor';
  address: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  restakingToken: LiquidRestakingToken;
};

export type RewardDistributor_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<RewardDistributor_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RewardDistributor_Filter>>>;
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

export enum RewardDistributor_OrderBy {
  Address = 'address',
  Id = 'id',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  asset?: Maybe<Asset>;
  assetRegistries: Array<AssetRegistry>;
  assetRegistry?: Maybe<AssetRegistry>;
  assets: Array<Asset>;
  avsregistries: Array<AvsRegistry>;
  avsregistry?: Maybe<AvsRegistry>;
  coordinator?: Maybe<Coordinator>;
  coordinators: Array<Coordinator>;
  deposit?: Maybe<Deposit>;
  depositPool?: Maybe<DepositPool>;
  depositPools: Array<DepositPool>;
  deposits: Array<Deposit>;
  issuer?: Maybe<Issuer>;
  issuers: Array<Issuer>;
  liquidRestakingToken?: Maybe<LiquidRestakingToken>;
  liquidRestakingTokens: Array<LiquidRestakingToken>;
  operator?: Maybe<Operator>;
  operatorDelegator?: Maybe<OperatorDelegator>;
  operatorDelegators: Array<OperatorDelegator>;
  operatorMetadata: Array<OperatorMetadata>;
  operatorRegistries: Array<OperatorRegistry>;
  operatorRegistry?: Maybe<OperatorRegistry>;
  operators: Array<Operator>;
  priceFeed?: Maybe<PriceFeed>;
  priceFeeds: Array<PriceFeed>;
  priceSource?: Maybe<PriceSource>;
  priceSources: Array<PriceSource>;
  rewardDistributor?: Maybe<RewardDistributor>;
  rewardDistributors: Array<RewardDistributor>;
  tokenTransfer?: Maybe<TokenTransfer>;
  tokenTransfers: Array<TokenTransfer>;
  underlyingAsset?: Maybe<UnderlyingAsset>;
  underlyingAssets: Array<UnderlyingAsset>;
  user?: Maybe<User>;
  users: Array<User>;
  validator?: Maybe<Validator>;
  validatorKeyIndex?: Maybe<ValidatorKeyIndex>;
  validatorKeyIndexes: Array<ValidatorKeyIndex>;
  validators: Array<Validator>;
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

export type SubscriptionAssetRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AssetRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AssetRegistry_Filter>;
};

export type SubscriptionAssetRegistryArgs = {
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

export type SubscriptionAvsregistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AvsRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AvsRegistry_Filter>;
};

export type SubscriptionAvsregistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
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

export type SubscriptionDepositPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDepositPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DepositPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DepositPool_Filter>;
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

export type SubscriptionOperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOperatorDelegatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOperatorDelegatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorDelegator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OperatorDelegator_Filter>;
};

export type SubscriptionOperatorMetadataArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorMetadata_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OperatorMetadata_Filter>;
};

export type SubscriptionOperatorRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OperatorRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OperatorRegistry_Filter>;
};

export type SubscriptionOperatorRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Operator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Operator_Filter>;
};

export type SubscriptionPriceFeedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPriceFeedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PriceFeed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PriceFeed_Filter>;
};

export type SubscriptionPriceSourceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPriceSourcesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PriceSource_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PriceSource_Filter>;
};

export type SubscriptionRewardDistributorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRewardDistributorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardDistributor_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardDistributor_Filter>;
};

export type SubscriptionTokenTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenTransfer_Filter>;
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

export type SubscriptionValidatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionValidatorKeyIndexArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionValidatorKeyIndexesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ValidatorKeyIndex_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ValidatorKeyIndex_Filter>;
};

export type SubscriptionValidatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Validator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Validator_Filter>;
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

export type TokenTransfer = {
  __typename?: 'TokenTransfer';
  amount: Scalars['BigDecimal']['output'];
  blockNumber: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  receiver: User;
  receiverBalanceAfter: Scalars['BigDecimal']['output'];
  receiverBalanceBefore: Scalars['BigDecimal']['output'];
  restakingToken: LiquidRestakingToken;
  restakingTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  sender: User;
  senderBalanceAfter: Scalars['BigDecimal']['output'];
  senderBalanceBefore: Scalars['BigDecimal']['output'];
  timestamp: Scalars['BigInt']['output'];
  tx: Scalars['Bytes']['output'];
  valueUSD?: Maybe<Scalars['BigDecimal']['output']>;
};

export type TokenTransfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<TokenTransfer_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<TokenTransfer_Filter>>>;
  receiver?: InputMaybe<Scalars['String']['input']>;
  receiverBalanceAfter?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceAfter_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceAfter_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceAfter_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  receiverBalanceAfter_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceAfter_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceAfter_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceAfter_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  receiverBalanceBefore?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceBefore_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceBefore_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceBefore_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  receiverBalanceBefore_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceBefore_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceBefore_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiverBalanceBefore_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  receiver_?: InputMaybe<User_Filter>;
  receiver_contains?: InputMaybe<Scalars['String']['input']>;
  receiver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  receiver_ends_with?: InputMaybe<Scalars['String']['input']>;
  receiver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  receiver_gt?: InputMaybe<Scalars['String']['input']>;
  receiver_gte?: InputMaybe<Scalars['String']['input']>;
  receiver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiver_lt?: InputMaybe<Scalars['String']['input']>;
  receiver_lte?: InputMaybe<Scalars['String']['input']>;
  receiver_not?: InputMaybe<Scalars['String']['input']>;
  receiver_not_contains?: InputMaybe<Scalars['String']['input']>;
  receiver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  receiver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  receiver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  receiver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  receiver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  receiver_starts_with?: InputMaybe<Scalars['String']['input']>;
  receiver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  restakingToken?: InputMaybe<Scalars['String']['input']>;
  restakingTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  restakingTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
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
  sender?: InputMaybe<Scalars['String']['input']>;
  senderBalanceAfter?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceAfter_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceAfter_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceAfter_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  senderBalanceAfter_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceAfter_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceAfter_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceAfter_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  senderBalanceBefore?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceBefore_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceBefore_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceBefore_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  senderBalanceBefore_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceBefore_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceBefore_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  senderBalanceBefore_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
  sender_?: InputMaybe<User_Filter>;
  sender_contains?: InputMaybe<Scalars['String']['input']>;
  sender_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_gt?: InputMaybe<Scalars['String']['input']>;
  sender_gte?: InputMaybe<Scalars['String']['input']>;
  sender_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_lt?: InputMaybe<Scalars['String']['input']>;
  sender_lte?: InputMaybe<Scalars['String']['input']>;
  sender_not?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains?: InputMaybe<Scalars['String']['input']>;
  sender_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  sender_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with?: InputMaybe<Scalars['String']['input']>;
  sender_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  valueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum TokenTransfer_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  Id = 'id',
  Receiver = 'receiver',
  ReceiverBalanceAfter = 'receiverBalanceAfter',
  ReceiverBalanceBefore = 'receiverBalanceBefore',
  ReceiverAddress = 'receiver__address',
  ReceiverBalance = 'receiver__balance',
  ReceiverId = 'receiver__id',
  RestakingToken = 'restakingToken',
  RestakingTokenPriceUsd = 'restakingTokenPriceUSD',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD',
  Sender = 'sender',
  SenderBalanceAfter = 'senderBalanceAfter',
  SenderBalanceBefore = 'senderBalanceBefore',
  SenderAddress = 'sender__address',
  SenderBalance = 'sender__balance',
  SenderId = 'sender__id',
  Timestamp = 'timestamp',
  Tx = 'tx',
  ValueUsd = 'valueUSD'
}

export type UnderlyingAsset = {
  __typename?: 'UnderlyingAsset';
  address: Scalars['Bytes']['output'];
  asset: Asset;
  balance: Scalars['BigDecimal']['output'];
  balanceInDepositPool: Scalars['BigDecimal']['output'];
  balanceInEigenLayer: Scalars['BigDecimal']['output'];
  depositCap: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  priceFeed: PriceFeed;
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
  priceFeed?: InputMaybe<Scalars['String']['input']>;
  priceFeed_?: InputMaybe<PriceFeed_Filter>;
  priceFeed_contains?: InputMaybe<Scalars['String']['input']>;
  priceFeed_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  priceFeed_ends_with?: InputMaybe<Scalars['String']['input']>;
  priceFeed_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceFeed_gt?: InputMaybe<Scalars['String']['input']>;
  priceFeed_gte?: InputMaybe<Scalars['String']['input']>;
  priceFeed_in?: InputMaybe<Array<Scalars['String']['input']>>;
  priceFeed_lt?: InputMaybe<Scalars['String']['input']>;
  priceFeed_lte?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_contains?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  priceFeed_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  priceFeed_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceFeed_starts_with?: InputMaybe<Scalars['String']['input']>;
  priceFeed_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  PriceFeedAddress = 'priceFeed__address',
  PriceFeedAssetPair = 'priceFeed__assetPair',
  PriceFeedDecimals = 'priceFeed__decimals',
  PriceFeedDescription = 'priceFeed__description',
  PriceFeedFeedType = 'priceFeed__feedType',
  PriceFeedId = 'priceFeed__id',
  PriceFeedLastUpdatedTimestamp = 'priceFeed__lastUpdatedTimestamp',
  PriceFeedPrice = 'priceFeed__price',
  PriceFeedQuoteAssetSymbol = 'priceFeed__quoteAssetSymbol',
  RestakingToken = 'restakingToken',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
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

export type Validator = {
  __typename?: 'Validator';
  delegator: OperatorDelegator;
  id: Scalars['ID']['output'];
  keyIndex: Scalars['BigInt']['output'];
  keyUploadTimestamp: Scalars['BigInt']['output'];
  keyUploadTx: Scalars['Bytes']['output'];
  publicKey: Scalars['Bytes']['output'];
  status: ValidatorStatus;
};

export type ValidatorKeyIndex = {
  __typename?: 'ValidatorKeyIndex';
  id: Scalars['ID']['output'];
  keyIndex: Scalars['BigInt']['output'];
  validator: Validator;
};

export type ValidatorKeyIndex_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ValidatorKeyIndex_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  keyIndex?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  keyIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ValidatorKeyIndex_Filter>>>;
  validator?: InputMaybe<Scalars['String']['input']>;
  validator_?: InputMaybe<Validator_Filter>;
  validator_contains?: InputMaybe<Scalars['String']['input']>;
  validator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  validator_ends_with?: InputMaybe<Scalars['String']['input']>;
  validator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  validator_gt?: InputMaybe<Scalars['String']['input']>;
  validator_gte?: InputMaybe<Scalars['String']['input']>;
  validator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  validator_lt?: InputMaybe<Scalars['String']['input']>;
  validator_lte?: InputMaybe<Scalars['String']['input']>;
  validator_not?: InputMaybe<Scalars['String']['input']>;
  validator_not_contains?: InputMaybe<Scalars['String']['input']>;
  validator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  validator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  validator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  validator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  validator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  validator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  validator_starts_with?: InputMaybe<Scalars['String']['input']>;
  validator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum ValidatorKeyIndex_OrderBy {
  Id = 'id',
  KeyIndex = 'keyIndex',
  Validator = 'validator',
  ValidatorId = 'validator__id',
  ValidatorKeyIndex = 'validator__keyIndex',
  ValidatorKeyUploadTimestamp = 'validator__keyUploadTimestamp',
  ValidatorKeyUploadTx = 'validator__keyUploadTx',
  ValidatorPublicKey = 'validator__publicKey',
  ValidatorStatus = 'validator__status'
}

export enum ValidatorStatus {
  Deposited = 'DEPOSITED',
  Exited = 'EXITED',
  Unused = 'UNUSED'
}

export type Validator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Validator_Filter>>>;
  delegator?: InputMaybe<Scalars['String']['input']>;
  delegator_?: InputMaybe<OperatorDelegator_Filter>;
  delegator_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_gt?: InputMaybe<Scalars['String']['input']>;
  delegator_gte?: InputMaybe<Scalars['String']['input']>;
  delegator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_lt?: InputMaybe<Scalars['String']['input']>;
  delegator_lte?: InputMaybe<Scalars['String']['input']>;
  delegator_not?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  keyIndex?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  keyIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  keyIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  keyUploadTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  keyUploadTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  keyUploadTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  keyUploadTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  keyUploadTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  keyUploadTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  keyUploadTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  keyUploadTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  keyUploadTx?: InputMaybe<Scalars['Bytes']['input']>;
  keyUploadTx_contains?: InputMaybe<Scalars['Bytes']['input']>;
  keyUploadTx_gt?: InputMaybe<Scalars['Bytes']['input']>;
  keyUploadTx_gte?: InputMaybe<Scalars['Bytes']['input']>;
  keyUploadTx_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  keyUploadTx_lt?: InputMaybe<Scalars['Bytes']['input']>;
  keyUploadTx_lte?: InputMaybe<Scalars['Bytes']['input']>;
  keyUploadTx_not?: InputMaybe<Scalars['Bytes']['input']>;
  keyUploadTx_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  keyUploadTx_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Validator_Filter>>>;
  publicKey?: InputMaybe<Scalars['Bytes']['input']>;
  publicKey_contains?: InputMaybe<Scalars['Bytes']['input']>;
  publicKey_gt?: InputMaybe<Scalars['Bytes']['input']>;
  publicKey_gte?: InputMaybe<Scalars['Bytes']['input']>;
  publicKey_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  publicKey_lt?: InputMaybe<Scalars['Bytes']['input']>;
  publicKey_lte?: InputMaybe<Scalars['Bytes']['input']>;
  publicKey_not?: InputMaybe<Scalars['Bytes']['input']>;
  publicKey_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  publicKey_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  status?: InputMaybe<ValidatorStatus>;
  status_in?: InputMaybe<Array<ValidatorStatus>>;
  status_not?: InputMaybe<ValidatorStatus>;
  status_not_in?: InputMaybe<Array<ValidatorStatus>>;
};

export enum Validator_OrderBy {
  Delegator = 'delegator',
  DelegatorAddress = 'delegator__address',
  DelegatorDelegatorId = 'delegator__delegatorId',
  DelegatorDepositedValidatorKeyCount = 'delegator__depositedValidatorKeyCount',
  DelegatorEarningsReceiver = 'delegator__earningsReceiver',
  DelegatorEigenPod = 'delegator__eigenPod',
  DelegatorExitedValidatorKeyCount = 'delegator__exitedValidatorKeyCount',
  DelegatorId = 'delegator__id',
  DelegatorManager = 'delegator__manager',
  DelegatorTotalValidatorKeyCount = 'delegator__totalValidatorKeyCount',
  DelegatorUnusedValidatorKeyCount = 'delegator__unusedValidatorKeyCount',
  Id = 'id',
  KeyIndex = 'keyIndex',
  KeyUploadTimestamp = 'keyUploadTimestamp',
  KeyUploadTx = 'keyUploadTx',
  PublicKey = 'publicKey',
  Status = 'status'
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
  restakingTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  sender: Scalars['Bytes']['output'];
  timestamp: Scalars['BigInt']['output'];
  tx: Scalars['Bytes']['output'];
  user: User;
  valueUSD?: Maybe<Scalars['BigDecimal']['output']>;
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
  restakingTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  restakingTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
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
  valueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  EpochAmountIn = 'epoch__amountIn',
  EpochAmountToBurnAtSettlement = 'epoch__amountToBurnAtSettlement',
  EpochAssetsReceived = 'epoch__assetsReceived',
  EpochClaimCount = 'epoch__claimCount',
  EpochEpoch = 'epoch__epoch',
  EpochId = 'epoch__id',
  EpochQueuedTimestamp = 'epoch__queuedTimestamp',
  EpochRequestCount = 'epoch__requestCount',
  EpochSettledTimestamp = 'epoch__settledTimestamp',
  EpochSharesOwed = 'epoch__sharesOwed',
  EpochStatus = 'epoch__status',
  Id = 'id',
  Requests = 'requests',
  RestakingToken = 'restakingToken',
  RestakingTokenPriceUsd = 'restakingTokenPriceUSD',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
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
  UserId = 'user__id',
  ValueUsd = 'valueUSD'
}

export type WithdrawalEpoch = {
  __typename?: 'WithdrawalEpoch';
  aggregateRoot?: Maybe<Scalars['Bytes']['output']>;
  amountIn: Scalars['BigDecimal']['output'];
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
  EpochAmountIn = 'epoch__amountIn',
  EpochAmountToBurnAtSettlement = 'epoch__amountToBurnAtSettlement',
  EpochAssetsReceived = 'epoch__assetsReceived',
  EpochClaimCount = 'epoch__claimCount',
  EpochEpoch = 'epoch__epoch',
  EpochId = 'epoch__id',
  EpochQueuedTimestamp = 'epoch__queuedTimestamp',
  EpochRequestCount = 'epoch__requestCount',
  EpochSettledTimestamp = 'epoch__settledTimestamp',
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
  amountIn?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountIn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountIn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  AmountIn = 'amountIn',
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
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
  RestakingTokenSymbol = 'restakingToken__symbol',
  RestakingTokenTotalSupply = 'restakingToken__totalSupply',
  RestakingTokenTotalValueEth = 'restakingToken__totalValueETH',
  RestakingTokenTotalValueUsd = 'restakingToken__totalValueUSD',
  SettledTimestamp = 'settledTimestamp',
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
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
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
  restakingTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  sender: Scalars['Bytes']['output'];
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
  restakingTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  restakingTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  restakingTokenPriceUSD_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']['input']>
  >;
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
  ClaimRestakingTokenPriceUsd = 'claim__restakingTokenPriceUSD',
  ClaimSender = 'claim__sender',
  ClaimTimestamp = 'claim__timestamp',
  ClaimTx = 'claim__tx',
  ClaimValueUsd = 'claim__valueUSD',
  Epoch = 'epoch',
  EpochAggregateRoot = 'epoch__aggregateRoot',
  EpochAmountIn = 'epoch__amountIn',
  EpochAmountToBurnAtSettlement = 'epoch__amountToBurnAtSettlement',
  EpochAssetsReceived = 'epoch__assetsReceived',
  EpochClaimCount = 'epoch__claimCount',
  EpochEpoch = 'epoch__epoch',
  EpochId = 'epoch__id',
  EpochQueuedTimestamp = 'epoch__queuedTimestamp',
  EpochRequestCount = 'epoch__requestCount',
  EpochSettledTimestamp = 'epoch__settledTimestamp',
  EpochSharesOwed = 'epoch__sharesOwed',
  EpochStatus = 'epoch__status',
  Id = 'id',
  IsClaimed = 'isClaimed',
  LogIndex = 'logIndex',
  RestakingToken = 'restakingToken',
  RestakingTokenPriceUsd = 'restakingTokenPriceUSD',
  RestakingTokenAddress = 'restakingToken__address',
  RestakingTokenCreatedTimestamp = 'restakingToken__createdTimestamp',
  RestakingTokenExchangeRateEth = 'restakingToken__exchangeRateETH',
  RestakingTokenExchangeRateUsd = 'restakingToken__exchangeRateUSD',
  RestakingTokenId = 'restakingToken__id',
  RestakingTokenName = 'restakingToken__name',
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
  totalValueETH?: any | null;
  totalValueUSD?: any | null;
  exchangeRateETH?: any | null;
  exchangeRateUSD?: any | null;
  underlyingAssets?: Array<{
    __typename?: 'UnderlyingAsset';
    address: any;
    strategy: any;
    depositCap: any;
    balance: any;
    asset: {
      __typename?: 'Asset';
      latestUSDPrice?: any | null;
      latestUSDPriceTimestamp?: any | null;
      symbol: string;
      name: string;
    };
  }> | null;
  coordinator: { __typename?: 'Coordinator'; id: string };
  assetRegistry: { __typename?: 'AssetRegistry'; id: string };
  operatorRegistry: { __typename?: 'OperatorRegistry'; id: string };
  avsRegistry: { __typename?: 'AVSRegistry'; id: string };
  depositPool: { __typename?: 'DepositPool'; id: string };
  withdrawalQueue: { __typename?: 'WithdrawalQueue'; id: string };
  rewardDistributor: { __typename?: 'RewardDistributor'; id: string };
};

export type DepositFieldsFragment = {
  __typename?: 'Deposit';
  id: string;
  sender: any;
  amountIn: any;
  amountOut: any;
  restakingTokenPriceUSD?: any | null;
  userBalanceAfter: any;
  valueUSD?: any | null;
  timestamp: any;
  blockNumber: any;
  tx: any;
  assetIn: { __typename?: 'Asset'; id: string };
  restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
};

export type TokenTransferFieldsFragment = {
  __typename?: 'TokenTransfer';
  id: string;
  amount: any;
  restakingTokenPriceUSD?: any | null;
  senderBalanceBefore: any;
  senderBalanceAfter: any;
  receiverBalanceBefore: any;
  receiverBalanceAfter: any;
  valueUSD?: any | null;
  timestamp: any;
  blockNumber: any;
  tx: any;
  receiver: { __typename?: 'User'; id: string };
  sender: { __typename?: 'User'; id: string };
  restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
};

export type WithdrawalRequestFieldsFragment = {
  __typename?: 'WithdrawalRequest';
  id: string;
  sender: any;
  amountIn: any;
  restakingTokenPriceUSD?: any | null;
  userBalanceAfter: any;
  valueUSD?: any | null;
  timestamp: any;
  blockNumber: any;
  tx: any;
  isClaimed: boolean;
  epoch: {
    __typename?: 'WithdrawalEpoch';
    epoch: any;
    status: WithdrawalEpochStatus;
    amountIn: any;
    assetsReceived: any;
  };
  assetOut: { __typename?: 'Asset'; id: string };
  restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
  claim?: { __typename?: 'WithdrawalClaim'; id: string; tx: any } | null;
};

export type WithdrawalClaimFieldsFragment = {
  __typename?: 'WithdrawalClaim';
  id: string;
  sender: any;
  amountOut: any;
  restakingTokenPriceUSD?: any | null;
  valueUSD?: any | null;
  timestamp: any;
  blockNumber: any;
  tx: any;
  epoch: { __typename?: 'WithdrawalEpoch'; epoch: any };
  assetOut: { __typename?: 'Asset'; id: string };
  restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
  requests?: Array<{ __typename?: 'WithdrawalRequest'; id: string }> | null;
};

export type OperatorDelegatorFieldsFragment = {
  __typename?: 'OperatorDelegator';
  id: string;
  delegatorId: number;
  address: any;
  manager: any;
  earningsReceiver: any;
  unusedValidatorKeyCount: any;
  depositedValidatorKeyCount: any;
  exitedValidatorKeyCount: any;
  totalValidatorKeyCount: any;
  operator: {
    __typename?: 'Operator';
    address: any;
    metadataURI: string;
    delegationApprover?: any | null;
    stakerOptOutWindowBlocks?: any | null;
    metadata?: {
      __typename?: 'OperatorMetadata';
      name?: string | null;
      website?: string | null;
      description?: string | null;
      logo?: string | null;
      twitter?: string | null;
    } | null;
  };
  restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
};

export type ValidatorFieldsFragment = {
  __typename?: 'Validator';
  id: string;
  status: ValidatorStatus;
  keyIndex: any;
  publicKey: any;
  keyUploadTimestamp: any;
  keyUploadTx: any;
  delegator: { __typename?: 'OperatorDelegator'; id: string };
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
    totalValueETH?: any | null;
    totalValueUSD?: any | null;
    exchangeRateETH?: any | null;
    exchangeRateUSD?: any | null;
    underlyingAssets?: Array<{
      __typename?: 'UnderlyingAsset';
      address: any;
      strategy: any;
      depositCap: any;
      balance: any;
      asset: {
        __typename?: 'Asset';
        latestUSDPrice?: any | null;
        latestUSDPriceTimestamp?: any | null;
        symbol: string;
        name: string;
      };
    }> | null;
    coordinator: { __typename?: 'Coordinator'; id: string };
    assetRegistry: { __typename?: 'AssetRegistry'; id: string };
    operatorRegistry: { __typename?: 'OperatorRegistry'; id: string };
    avsRegistry: { __typename?: 'AVSRegistry'; id: string };
    depositPool: { __typename?: 'DepositPool'; id: string };
    withdrawalQueue: { __typename?: 'WithdrawalQueue'; id: string };
    rewardDistributor: { __typename?: 'RewardDistributor'; id: string };
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
    totalValueETH?: any | null;
    totalValueUSD?: any | null;
    exchangeRateETH?: any | null;
    exchangeRateUSD?: any | null;
    underlyingAssets?: Array<{
      __typename?: 'UnderlyingAsset';
      address: any;
      strategy: any;
      depositCap: any;
      balance: any;
      asset: {
        __typename?: 'Asset';
        latestUSDPrice?: any | null;
        latestUSDPriceTimestamp?: any | null;
        symbol: string;
        name: string;
      };
    }> | null;
    coordinator: { __typename?: 'Coordinator'; id: string };
    assetRegistry: { __typename?: 'AssetRegistry'; id: string };
    operatorRegistry: { __typename?: 'OperatorRegistry'; id: string };
    avsRegistry: { __typename?: 'AVSRegistry'; id: string };
    depositPool: { __typename?: 'DepositPool'; id: string };
    withdrawalQueue: { __typename?: 'WithdrawalQueue'; id: string };
    rewardDistributor: { __typename?: 'RewardDistributor'; id: string };
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
    restakingTokenPriceUSD?: any | null;
    userBalanceAfter: any;
    valueUSD?: any | null;
    timestamp: any;
    blockNumber: any;
    tx: any;
    assetIn: { __typename?: 'Asset'; id: string };
    restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
  }>;
};

export type ManyTokenTransfersQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy?: InputMaybe<TokenTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TokenTransfer_Filter>;
}>;

export type ManyTokenTransfersQuery = {
  __typename?: 'Query';
  tokenTransfers: Array<{
    __typename?: 'TokenTransfer';
    id: string;
    amount: any;
    restakingTokenPriceUSD?: any | null;
    senderBalanceBefore: any;
    senderBalanceAfter: any;
    receiverBalanceBefore: any;
    receiverBalanceAfter: any;
    valueUSD?: any | null;
    timestamp: any;
    blockNumber: any;
    tx: any;
    receiver: { __typename?: 'User'; id: string };
    sender: { __typename?: 'User'; id: string };
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
    amountIn: any;
    restakingTokenPriceUSD?: any | null;
    userBalanceAfter: any;
    valueUSD?: any | null;
    timestamp: any;
    blockNumber: any;
    tx: any;
    isClaimed: boolean;
    epoch: {
      __typename?: 'WithdrawalEpoch';
      epoch: any;
      status: WithdrawalEpochStatus;
      amountIn: any;
      assetsReceived: any;
    };
    assetOut: { __typename?: 'Asset'; id: string };
    restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
    claim?: { __typename?: 'WithdrawalClaim'; id: string; tx: any } | null;
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
    restakingTokenPriceUSD?: any | null;
    valueUSD?: any | null;
    timestamp: any;
    blockNumber: any;
    tx: any;
    epoch: { __typename?: 'WithdrawalEpoch'; epoch: any };
    assetOut: { __typename?: 'Asset'; id: string };
    restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
    requests?: Array<{ __typename?: 'WithdrawalRequest'; id: string }> | null;
  }>;
};

export type ManyOperatorDelegatorsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy?: InputMaybe<OperatorDelegator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OperatorDelegator_Filter>;
}>;

export type ManyOperatorDelegatorsQuery = {
  __typename?: 'Query';
  operatorDelegators: Array<{
    __typename?: 'OperatorDelegator';
    id: string;
    delegatorId: number;
    address: any;
    manager: any;
    earningsReceiver: any;
    unusedValidatorKeyCount: any;
    depositedValidatorKeyCount: any;
    exitedValidatorKeyCount: any;
    totalValidatorKeyCount: any;
    operator: {
      __typename?: 'Operator';
      address: any;
      metadataURI: string;
      delegationApprover?: any | null;
      stakerOptOutWindowBlocks?: any | null;
      metadata?: {
        __typename?: 'OperatorMetadata';
        name?: string | null;
        website?: string | null;
        description?: string | null;
        logo?: string | null;
        twitter?: string | null;
      } | null;
    };
    restakingToken: { __typename?: 'LiquidRestakingToken'; id: string };
  }>;
};

export type ManyValidatorsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  orderBy?: InputMaybe<Validator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Validator_Filter>;
}>;

export type ManyValidatorsQuery = {
  __typename?: 'Query';
  validators: Array<{
    __typename?: 'Validator';
    id: string;
    status: ValidatorStatus;
    keyIndex: any;
    publicKey: any;
    keyUploadTimestamp: any;
    keyUploadTx: any;
    delegator: { __typename?: 'OperatorDelegator'; id: string };
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
          { kind: 'Field', name: { kind: 'Name', value: 'totalValueETH' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalValueUSD' } },
          { kind: 'Field', name: { kind: 'Name', value: 'exchangeRateETH' } },
          { kind: 'Field', name: { kind: 'Name', value: 'exchangeRateUSD' } },
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
                        name: { kind: 'Name', value: 'latestUSDPrice' }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'latestUSDPriceTimestamp' }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'symbol' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'strategy' } },
                { kind: 'Field', name: { kind: 'Name', value: 'depositCap' } },
                { kind: 'Field', name: { kind: 'Name', value: 'balance' } }
              ]
            }
          },
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
            name: { kind: 'Name', value: 'assetRegistry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'operatorRegistry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'avsRegistry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'depositPool' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'withdrawalQueue' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rewardDistributor' },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingTokenPriceUSD' }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'userBalanceAfter' } },
          { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<DepositFieldsFragment, unknown>;
export const TokenTransferFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TokenTransferFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TokenTransfer' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receiver' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sender' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
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
          { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingTokenPriceUSD' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'senderBalanceBefore' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'senderBalanceAfter' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receiverBalanceBefore' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receiverBalanceAfter' }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<TokenTransferFieldsFragment, unknown>;
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
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountIn' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'assetsReceived' }
                }
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingTokenPriceUSD' }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'userBalanceAfter' } },
          { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
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
            name: { kind: 'Name', value: 'restakingTokenPriceUSD' }
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
          { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<WithdrawalClaimFieldsFragment, unknown>;
export const OperatorDelegatorFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OperatorDelegatorFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'OperatorDelegator' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'delegatorId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'operator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadataURI' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'metadata' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'website' }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'logo' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'twitter' }
                      }
                    ]
                  }
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'delegationApprover' }
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'stakerOptOutWindowBlocks' }
                }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'manager' } },
          { kind: 'Field', name: { kind: 'Name', value: 'earningsReceiver' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unusedValidatorKeyCount' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'depositedValidatorKeyCount' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'exitedValidatorKeyCount' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'totalValidatorKeyCount' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingToken' },
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
} as unknown as DocumentNode<OperatorDelegatorFieldsFragment, unknown>;
export const ValidatorFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ValidatorFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Validator' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'delegator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'keyIndex' } },
          { kind: 'Field', name: { kind: 'Name', value: 'publicKey' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'keyUploadTimestamp' }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'keyUploadTx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<ValidatorFieldsFragment, unknown>;
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
          { kind: 'Field', name: { kind: 'Name', value: 'totalValueETH' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalValueUSD' } },
          { kind: 'Field', name: { kind: 'Name', value: 'exchangeRateETH' } },
          { kind: 'Field', name: { kind: 'Name', value: 'exchangeRateUSD' } },
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
                        name: { kind: 'Name', value: 'latestUSDPrice' }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'latestUSDPriceTimestamp' }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'symbol' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'strategy' } },
                { kind: 'Field', name: { kind: 'Name', value: 'depositCap' } },
                { kind: 'Field', name: { kind: 'Name', value: 'balance' } }
              ]
            }
          },
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
            name: { kind: 'Name', value: 'assetRegistry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'operatorRegistry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'avsRegistry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'depositPool' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'withdrawalQueue' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rewardDistributor' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'totalValueETH' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalValueUSD' } },
          { kind: 'Field', name: { kind: 'Name', value: 'exchangeRateETH' } },
          { kind: 'Field', name: { kind: 'Name', value: 'exchangeRateUSD' } },
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
                        name: { kind: 'Name', value: 'latestUSDPrice' }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'latestUSDPriceTimestamp' }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'symbol' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'strategy' } },
                { kind: 'Field', name: { kind: 'Name', value: 'depositCap' } },
                { kind: 'Field', name: { kind: 'Name', value: 'balance' } }
              ]
            }
          },
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
            name: { kind: 'Name', value: 'assetRegistry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'operatorRegistry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'avsRegistry' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'depositPool' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'withdrawalQueue' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rewardDistributor' },
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingTokenPriceUSD' }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'userBalanceAfter' } },
          { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<ManyDepositsQuery, ManyDepositsQueryVariables>;
export const ManyTokenTransfersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manyTokenTransfers' },
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
            name: { kind: 'Name', value: 'TokenTransfer_orderBy' }
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
            name: { kind: 'Name', value: 'TokenTransfer_filter' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tokenTransfers' },
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
                  name: { kind: 'Name', value: 'TokenTransferFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TokenTransferFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TokenTransfer' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receiver' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sender' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
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
          { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingTokenPriceUSD' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'senderBalanceBefore' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'senderBalanceAfter' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receiverBalanceBefore' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receiverBalanceAfter' }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blockNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  ManyTokenTransfersQuery,
  ManyTokenTransfersQueryVariables
>;
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
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amountIn' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'assetsReceived' }
                }
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
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingTokenPriceUSD' }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'userBalanceAfter' } },
          { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
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
            name: { kind: 'Name', value: 'restakingTokenPriceUSD' }
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
          { kind: 'Field', name: { kind: 'Name', value: 'valueUSD' } },
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
export const ManyOperatorDelegatorsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manyOperatorDelegators' },
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
            name: { kind: 'Name', value: 'OperatorDelegator_orderBy' }
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
            name: { kind: 'Name', value: 'OperatorDelegator_filter' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'operatorDelegators' },
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
                  name: { kind: 'Name', value: 'OperatorDelegatorFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OperatorDelegatorFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'OperatorDelegator' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'delegatorId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'address' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'operator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'metadataURI' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'metadata' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'website' }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'logo' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'twitter' }
                      }
                    ]
                  }
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'delegationApprover' }
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'stakerOptOutWindowBlocks' }
                }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'manager' } },
          { kind: 'Field', name: { kind: 'Name', value: 'earningsReceiver' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unusedValidatorKeyCount' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'depositedValidatorKeyCount' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'exitedValidatorKeyCount' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'totalValidatorKeyCount' }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'restakingToken' },
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
  ManyOperatorDelegatorsQuery,
  ManyOperatorDelegatorsQueryVariables
>;
export const ManyValidatorsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'manyValidators' },
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
            name: { kind: 'Name', value: 'Validator_orderBy' }
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
            name: { kind: 'Name', value: 'Validator_filter' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'validators' },
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
                  name: { kind: 'Name', value: 'ValidatorFields' }
                }
              ]
            }
          }
        ]
      }
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ValidatorFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Validator' }
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'delegator' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } }
              ]
            }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'keyIndex' } },
          { kind: 'Field', name: { kind: 'Name', value: 'publicKey' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'keyUploadTimestamp' }
          },
          { kind: 'Field', name: { kind: 'Name', value: 'keyUploadTx' } }
        ]
      }
    }
  ]
} as unknown as DocumentNode<ManyValidatorsQuery, ManyValidatorsQueryVariables>;
