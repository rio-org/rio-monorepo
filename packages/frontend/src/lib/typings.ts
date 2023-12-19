import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { ExitType, JoinType } from '@rionetwork/sdk-react';
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

// used for demo
export interface Proposal {
  id: string;
  title: string;
  description: string;
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

export interface NetworkStats {
  tvl: number;
  apr: number;
}

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

export interface AssetSubgraphResponse {
  name: string;
  symbol: TokenSymbol;
  address: EthereumAddress | null;
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

export interface WithdrawEvent {
  date: string;
  status: TransactionStatus;
  symbol: TokenSymbol;
  amount: number;
}

export type TransactionStatus = 'Pending' | 'Available' | 'Claimed' | 'None';

// export interface TransactionEvent {
//   date: string;
//   txId: string;
//   type: string;
//   historicalReEthPrice: number;
//   amountReEth: number;
//   balance: number;
// }

export interface ExitSubgraphResponse {
  id: string;
  type: ExitType;
  sender: EthereumAddress;
  tokensOut: {
    symbol: TokenSymbol,
    latestUSDPrice: string,
    latestUSDPriceTimestamp: string
  }[];
  amountsOut: string[];
  sharesOwed: string[];
  amountIn: string;
  restakingToken: EthereumAddress;
  tx: string;
  timestamp: string;
}

export interface TransactionEventSubgraphResponse {
  type: ExitType;
  amountsOut: string[] | null;
  amountOut: string | null;
  amountIn: string;
  valueUSD: string;
  tx: string;
  timestamp: string;
  user: {
    address: EthereumAddress;
  };
}



// export interface JoinSubgraphResponse {
//   id: string;
//   type: JoinType;
//   sender: EthereumAddress;
//   amountsIn: string[];
//   amountOut: string;
//   tx: string;
//   tokensIn: EthereumAddress[];
//   restakingToken: EthereumAddress;
//   timestamp: string;
// }

export type TransactionType = "Deposit" | "Withdrawal";

export interface TransactionEvent {
  date: string;
  type: TransactionType;
  // amountsIn: string[];
  // amountOut: string;
  tx: string;
  // tokensIn: EthereumAddress[];
  historicalReEthPrice: number;
  amountReEth: number;
  balance: number;
}


// export type ExitType = "TOKEN_EXACT_IN" | "ALL_TOKENS_EXACT_IN" | "TOKENS_EXACT_OUT"

// export type Exit = {
//   amountIn: string;
//   amountsOut: string[];
//   sender: string;
//   sharesOwed: string[];
//   tx: EthereumTransactionHash;
//   type: ExitType;
//   user: {
//     address: EthereumAddress;
//   };
// }