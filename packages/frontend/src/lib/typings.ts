import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { ExitType } from '@rionetwork/sdk-react';
import { StaticImageData } from 'next/image';
import { Chain as WagmiChain } from 'wagmi';
export type EthereumAddress = `0x${string}`;
export type EthereumTransactionHash = `0x${string}`;
export type EthereumCalldata = string;
export type IPFSAddress = string;
export type AddressType = `0x${string}`;
export type BytesType = `0x${string}`;
export type CHAIN_ID_NUMBER =
  | 1
  | 5
  | 11155111
  | 10
  | 420
  | 8453
  | 84531
  | 7777777
  | 999
  | 31337;
export const enum CHAIN_ID {
  ETHEREUM = 1,
  GOERLI = 5,
  OPTIMISM = 10,
  OPTIMISM_GOERLI = 420,
  BASE = 8453,
  BASE_GOERLI = 84531,
  ZORA = 7777777,
  ZORA_GOERLI = 999,
  FOUNDRY = 31337
}

export interface Chain extends WagmiChain {
  id: CHAIN_ID;
  slug: string;
  icon: string;
}

export interface ConnectButtonProps {
  account?: {
    address: string;
    balanceDecimals?: number;
    balanceFormatted?: string;
    balanceSymbol?: string;
    displayBalance?: string;
    displayName: string;
    ensAvatar?: string;
    ensName?: string;
    hasPendingTransactions: boolean;
  };
  chain?: {
    hasIcon: boolean;
    iconUrl?: string;
    iconBackground?: string;
    id: number;
    name?: string;
    unsupported?: boolean;
  };
  mounted: boolean;
  authenticationStatus?: AuthenticationStatus;
  openAccountModal: () => void;
  openChainModal: () => void;
  openConnectModal: () => void;
  accountModalOpen: boolean;
  chainModalOpen: boolean;
  connectModalOpen: boolean;
}

// TODO: remove this when we have a proper type for the subgraph response
export interface NetworkStats {
  tvl: number;
  apr: number;
}

///////////////////////////
// asset types
///////////////////////////
export type Asset = {
  [key in TokenSymbol]: AssetDetails;
};

export interface AssetDetails {
  name: string;
  symbol: TokenSymbol;
  address: EthereumAddress;
  logo: StaticImageData;
  decimals: number;
}

export interface AssetPrice {
  address: EthereumAddress;
  symbol: TokenSymbol;
  latestUSDPrice: number;
  latestUSDPriceTimestamp: number;
}

export type TokenSymbol =
  | 'ETH'
  | 'WETH'
  | 'reETH'
  | 'stETH'
  | 'rETH'
  | 'cbETH'
  | 'wstETH'
  | '＊ETH';

export type AssetAddress = {
  [key in TokenSymbol]: AddressType | null;
};

///////////////////////////
// transaction types
///////////////////////////

export type TransactionType = 'Deposit' | 'Withdrawal';
export type TransactionStatus = 'Pending' | 'Available' | 'Claimed' | 'None';
export interface WithdrawEvent {
  date: string;
  status: TransactionStatus;
  symbol: TokenSymbol;
  amount: number;
  tx: string;
}

export interface TransactionEvent {
  date: string;
  type: TransactionType;
  tx: string;
  historicalReEthPrice: number;
  amountReEth: string;
  balance: string;
}

///////////////////////////
// subgraph response types
///////////////////////////
export interface ExitSubgraphResponse {
  id: string;
  type: ExitType;
  sender: EthereumAddress;
  tokensOut: {
    symbol: TokenSymbol;
    latestUSDPrice: string;
    latestUSDPriceTimestamp: string;
  }[];
  amountsOut: string[];
  sharesOwed: string[];
  amountIn: string;
  restakingToken: EthereumAddress;
  tx: string;
  timestamp: string;
}

export interface AssetSubgraphResponse {
  name: string;
  symbol: TokenSymbol;
  address: EthereumAddress | null;
  decimals: number;
}

export interface TransactionEventSubgraphResponse {
  type: ExitType;
  amountsOut: string[] | null;
  amountOut: string | null;
  amountIn: string;
  amountsIn: string[] | null;
  valueUSD: string;
  tx: string;
  timestamp: string;
  userBalanceAfter: string;
  user: {
    address: EthereumAddress;
  };
}