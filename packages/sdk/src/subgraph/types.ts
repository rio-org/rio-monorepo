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
  latestUSDPrice: string | null;
  latestUSDPriceTimestamp: string | null;
  strategy: Address;
  depositCap: string;
  balance: string;
}

export interface ContractDeployment {
  coordinator: Address;
  assetRegistry: Address;
  operatorRegistry: Address;
  avsRegistry: Address;
  depositPool: Address;
  withdrawalQueue: Address;
  rewardDistributor: Address;
}

export interface LiquidRestakingToken {
  address: Address;
  symbol: string;
  name: string;
  createdTimestamp: string;
  totalSupply: string;
  totalValueETH: string | null;
  totalValueUSD: string | null;
  exchangeRateETH: string | null;
  exchangeRateUSD: string | null;
  percentAPY: string | null;
  underlyingAssets: UnderlyingAsset[];
  deployment: ContractDeployment;
}

export interface Deposit {
  id: string;
  sender: Address;
  assetIn: Address;
  amountIn: string;
  amountOut: string;
  valueUSD: string | null;
  timestamp: string;
  blockNumber: string;
  restakingToken: Address;
  restakingTokenPriceUSD: string | null;
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
  amountOut: string | null; // Populated on epoch settlement.
  sharesOwed: string;
  amountIn: string;
  valueUSD: string | null;
  restakingToken: Address;
  restakingTokenPriceUSD: string | null;
  userBalanceAfter: string;
  timestamp: string;
  blockNumber: string;
  tx: string;

  // Populated on withdrawal claim.
  isReadyToClaim: boolean;
  isClaimed: boolean;
  claimId: string | null;
  claimTx: string | null;
}

export interface WithdrawalClaim {
  id: string;
  sender: Address;
  epoch: string;
  assetOut: Address;
  amountClaimed: string;
  restakingToken: Address;
  restakingTokenPriceUSD: string | null;
  requestIds: string[];
  valueUSD: string | null;
  timestamp: string;
  blockNumber: string;
  tx: string;
}

export interface OperatorDelegator {
  delegatorId: number;
  address: Address;
  manager: Address;
  operator: Operator;
  earningsReceiver: Address;
  unusedValidatorKeyCount: string;
  depositedValidatorKeyCount: string;
  exitedValidatorKeyCount: string;
  totalValidatorKeyCount: string;
  restakingToken: Address;
}

export interface Operator {
  address: Address;
  metadataURI: string;
  name: string | null;
  website: string | null;
  description: string | null;
  logo: string | null;
  twitter: string | null;
  delegationApprover: Address;
  stakerOptOutWindowBlocks: number;
}

export enum ValidatorStatus {
  Unused = 'UNUSED',
  Deposited = 'DEPOSITED',
  Exited = 'EXITED'
}

export interface Validator {
  status: ValidatorStatus;
  delegator: Address;
  publicKey: string;
  keyUploadTimestamp: string;
  keyUploadLogIndex: string;
  keyUploadTx: string;
}

//#endregion
