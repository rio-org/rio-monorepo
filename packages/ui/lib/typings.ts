import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype';
import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { NextApiRequest, NextApiResponse } from 'next';
import { StaticImageData } from 'next/image';
import { Chain as WagmiChain } from 'wagmi/chains';
import { NextRequest } from 'next/server';
import { Address, Hash } from 'viem';
import { RioLRTOperatorRegistryABI } from '../abi/RioLRTOperatorRegistryABI';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export type NumberString = `${number}`;
export type EthereumTransactionHash = `0x${string}`;
export type EthereumCalldata = string;
export type IPFSAddress = string;
export type AddressType = `0x${string}`;
export type BytesType = `0x${string}`;
export type CHAIN_ID_NUMBER =
  | 1
  | 5
  | 17000
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

export const enum AppEnv {
  PRODUCTION = 'production',
  PREVIEW = 'preview',
  DEVELOPMENT = 'development'
}

export type Not<T, R> = T extends R ? never : T;

//////////////
// Interface
//////////////

export interface NavigatorWithUAD extends Navigator {
  userAgentData?: {
    brands?: string[];
    mobile?: boolean;
    platform?: string;
  };
}

export type HotKeyShift = 'shift' | 'no-shift';
export type HotKeyAction = 'action' | 'no-action';
export type HotKeyAlt = 'alt' | 'no-alt';
export type HotKeyKey = string;
export type HotKeyString =
  `${HotKeyShift}+${HotKeyAlt}+${HotKeyAction}+${HotKeyKey}`;
export type HotKeys = Record<HotKeyString, () => void>;

export type WindowSize = {
  width: number;
  height: number;
};

export type MousePosition = {
  clientX: number;
  clientY: number;
};

export interface InternalAppNavItem {
  label: string;
  slug: string;
}

export interface NavItem {
  label: string;
  url?: string;
  external: boolean;
  icon?: string;
  disabled?: boolean;
  hideOn?: ('mobile' | 'desktop')[];
}

export interface LogoNavItem extends Omit<NavItem, 'url'> {
  url: string;
}

export interface SocialNavItem extends Omit<NavItem, 'icon' | 'url'> {
  url: string;
  icon: string;
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

export type TableLabelProps = {
  children: React.ReactNode;
  textDirection?: 'left' | 'right';
  isSecondary?: boolean;
  className?: string;
};

export type TableColumn<T, R = keyof T> = {
  key: R;
  label?: string;
  render?: (
    TableLabelComponent: React.FC<TableLabelProps>,
    item: T,
    key: R
  ) => React.ReactNode;
};

export type MobileTableColumns<T> = {
  top: TableColumn<T>[];
  expanded: TableColumn<T>[];
};

export enum RestakeFormTab {
  RESTAKE = 'Restake',
  WITHDRAW = 'Withdraw'
}

///////////////////////////
// asset types
///////////////////////////
export type Asset = {
  [key in TokenSymbol]: AssetDetails;
};

export interface AssetFinancials<T extends number | NumberString = number> {
  latestUSDPrice: T | null;
  latestUSDPriceTimestamp: T | null;
}

export interface LRTFinancials<T extends number | NumberString = number> {
  totalSupply: T;
  totalValueUSD: T | null;
  totalValueETH: T | null;
  exchangeRateUSD: T | null;
  exchangeRateETH: T | null;
}

export interface BaseAssetDetails {
  name: string;
  symbol: TokenSymbol;
  address: Address;
  logo: StaticImageData;
  decimals: number;
}

export interface AssetDetails
  extends BaseAssetDetails,
    AssetFinancials<number> {}

export interface UnderlyingAssetDetails {
  id: string;
  balance: number;
  strategy: Address;
  asset: AssetDetails;
}

export interface LRTDetails extends BaseAssetDetails, LRTFinancials {
  underlyingAssets: UnderlyingAssetDetails[];
}

export interface AssetPrice {
  address: Address;
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

export enum TransactionType {
  Deposit = 'Deposit',
  Request = 'Withdrawal Request',
  Claim = 'Claim'
}
export type TransactionStatus = 'Pending' | 'Available' | 'Claimed' | 'None';
export interface WithdrawEvent {
  date: string;
  status: TransactionStatus;
  symbol: TokenSymbol;
  amount: number;
  tx: string;
}

export interface TransactionEvent {
  type: TransactionType;
  date: string;
  address: Address;
  valueUSD: number;
  amountChange: number;
  amountChangeSymbol: string;
  restakingToken: BaseAssetDetails;
  restakingTokenPriceUSD: number;
  userBalanceAfter: number;
  tx: Hash;
}

///////////////////////////
// subgraph response types
///////////////////////////
export interface ExitSubgraphResponse {
  id: string;
  type: unknown;
  sender: Address;
  tokensOut: {
    symbol: TokenSymbol;
    latestUSDPrice: string;
    latestUSDPriceTimestamp: string;
  }[];
  amountsOut: string[];
  sharesOwed: string[];
  amountIn: string;
  restakingToken: Address;
  tx: string;
  timestamp: string;
}

export interface TransactionEventSubgraphResponse {
  type: unknown;
  amountsOut: string[] | null;
  amountOut: string | null;
  amountIn: string;
  amountsIn: string[] | null;
  valueUSD: string;
  tx: string;
  timestamp: string;
  userBalanceAfter: string;
  user: {
    address: Address;
  };
}

export interface BaseAssetSubgraphResponse {
  name: string;
  symbol: TokenSymbol;
  address: Address | null;
  decimals: number;
}

export interface AssetSubgraphResponse
  extends BaseAssetSubgraphResponse,
    AssetFinancials<NumberString> {}

export interface UnderlyingAssetSubgraphResponse {
  id: string;
  balance: NumberString;
  strategy: Address;
  asset: AssetSubgraphResponse;
}

export interface BaseLRTSubgraphResponse
  extends Omit<BaseAssetSubgraphResponse, 'decimals'> {}
export interface LRTSubgraphResponse
  extends Omit<BaseAssetSubgraphResponse, 'decimals'>,
    LRTFinancials<NumberString> {
  underlyingAssets: UnderlyingAssetSubgraphResponse[];
}

///////////////////////
// API Responses
///////////////////////

export type RewardsResponse = {
  eth_rewards_in_period: string;
  yearly_rewards_percent: string;
};

///////////////////////
// Validator/Operator
///////////////////////

export interface ValidatorKeyItem {
  pubkey: string;
  withdrawal_credentials: string;
  amount: number;
  signature: string;
  fork_version: string;
  eth2_network_name: string;
  deposit_message_root: string;
  deposit_data_root: string;
}

export type OperatorDetails = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<
    typeof RioLRTOperatorRegistryABI,
    'getOperatorDetails'
  >['outputs']
>[number];

///////////////////////
// Transaction Store
///////////////////////

export enum RioTransactionType {
  // Restake
  DEPOSIT = 'DEPOSIT',
  WITHDRAW_REQUEST = 'WITHDRAW_REQUEST',
  CLAIM = 'CLAIM',
  // Operators
  SUBMIT_KEYS = 'SUBMIT_KEYS',
  CLAIM_EARNINGS = 'CLAIM_EARNINGS',
  UPDATE_OPERATOR_VALUE = 'UPDATE_OPERATOR_VALUE',
  REMOVE_PENDING_KEYS = 'REMOVE_PENDING_KEYS'
}

export type PendingTransaction = {
  hash: Hash;
  type: RioTransactionType;
  chainId: number;
  toasts: {
    sent: string;
    success: string;
    error: string;
  };
};

export interface TransactionStore {
  past: {
    [hash: Hash]: true;
  };
  current: {
    [chainId: number]: PendingTransaction[];
  };
}

////////
// API
////////

export type Methods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Handler = (req: NextApiRequest, res: NextApiResponse) => unknown;
export type EdgeFunction = (req: Request | NextRequest) => Promise<unknown>;

export type RequestHandlers = { [method in Methods]?: Handler };
export type EdgeFunctionHandlers = { [method in Methods]?: EdgeFunction };

export type FAQ = {
  q: string;
  a: string;
  tab?: string;
};

export type FAQsDirectory = {
  [pathname: string]: FAQ[];
};

export type GeoFencingEdgeStore = {
  'blocked-country-codes': string[];
  'whitelist-ips': string[];
};

export type FAQsEdgeStore = {
  restaking: FAQsDirectory;
  operator: FAQsDirectory;
};

///////////
// Errors
///////////

export type ContractError = Error & { shortMessage?: string };

export type ApiErrorKind =
  | 'TRANSACTION_ERROR'
  | 'UNSUPPORTED_CONTRACT'
  | 'SYSTEM_ERROR'
  | 'REQUEST_FAILURE'
  | 'ABI_ERROR'
  | 'NOT_JSON'
  | 'NON_200'
  | 'NOT_FOUND'
  | 'RETRY_LIMIT'
  | 'MISCONFIGURATION'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'METHOD_NOT_ALLOWED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'HTTP_ERROR'
  | 'SUBSYSTEM_ERROR'
  | 'LOCKED'
  | 'TEAPOT'
  | 'FAHRENHEIT';

///////////
// Misc
///////////

interface UnionBuilder<T = never> {
  add: <NewValue>(type?: NewValue) => UnionBuilder<T | NewValue>;
  type: T;
}

export const UnionBuilder = new (class UnionBuilder<T = never>
  implements UnionBuilder<T>
{
  public type: T;

  constructor(value?: T) {
    this.type = value as unknown as T;
  }

  public add = <NewValue>(value?: NewValue) => {
    return new UnionBuilder<T | NewValue>(value as NewValue);
  };
})();
