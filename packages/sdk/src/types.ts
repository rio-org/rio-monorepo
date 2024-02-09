import { FeeValues, Address as ViemAddress } from 'viem';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Address = ViemAddress | string;

export type TxOverrideBase<TQuantity = bigint, TIndex = number> = {
  /** Gas provided for transaction execution */
  gas?: TQuantity;
  /** Unique number identifying this transaction */
  nonce?: TIndex;
};

export type TxOverrides<TQuantity = bigint> = TxOverrideBase<TQuantity> &
  FeeValues<TQuantity>;

//#region Read Functions

export interface EstimateOutDepositETHParams {
  /**
   * The amount of ETH to deposit.
   */
  amount: string | bigint;
}

export interface EstimateOutRequestWithdrawalParams {
  /**
   * The address of the asset to withdraw.
   */
  assetOut: Address;
  /**
   * The amount of restaking tokens to burn.
   */
  amountIn: string | bigint;
}

//#endregion

//#region Write Functions

export interface DepositParams {
  /**
   * The address of the token to deposit.
   */
  tokenIn: Address;
  /**
   * The amount of the asset to deposit.
   */
  amount: string | bigint;
}

export interface DepositETHParams {
  /**
   * The amount of ETH to deposit.
   */
  amount: string | bigint;
}

export interface RequestWithdrawalParams {
  /**
   * The address of the asset to withdraw.
   */
  assetOut: Address;
  /**
   * The amount of restaking tokens to burn.
   */
  amountIn: string | bigint;
}

export interface ClaimWithdrawalParams {
  /**
   * The address of the asset to withdraw.
   */
  assetOut: Address;
  /**
   * The withdrawal epoch.
   */
  epoch: string | bigint;
}

//#endregion
