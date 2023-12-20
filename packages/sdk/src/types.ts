import { Address as ViemAddress } from 'viem';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Address = ViemAddress | string;

export interface InputTokenExactIn {
  /**
   * The address of the input token.
   */
  address: Address;
  /**
   * The exact amount of the input token to send.
   */
  amount: string | bigint;
}

export interface OutputTokenMinOut {
  /**
   * The address of the output token.
   */
  address: Address;
  /**
   * The minimum acceptable amount of the output token to receive.
   */
  minAmount: string | bigint;
}

export interface InputTokenExactInWithWrap extends InputTokenExactIn {
  requiresWrap?: boolean;
}

export interface OutputTokenMinOutWithUnwrap extends OutputTokenMinOut {
  requiresUnwrap?: boolean;
}

//#region Query Functions

export interface QueryJoinTokensExactInParams {
  /**
   * The tokens to join with.
   */
  tokensIn: InputTokenExactIn[];
  /**
   * The slippage value in BPT - i.e. 50 = 0.5%
   */
  slippage: string | number;
}

export interface QueryExitTokenExactInParams {
  /**
   * The amount of LRT to exit with.
   */
  amountIn: string | bigint;
  /**
   * The token to exit to.
   */
  tokenOut: Address;
  /**
   * The slippage value in BPT - i.e. 50 = 0.5%
   */
  slippage: string | number;
}

//#endregion

//#region Write Functions

export interface JoinTokensExactInParams {
  /**
   * The tokens to join with, including information about whether or not
   * they need to be wrapped.
   */
  tokensIn: InputTokenExactInWithWrap[];
  /**
   * The minimum acceptable amount of LRT to receive.
   */
  minAmountOut: string | bigint;
}

export interface ExitTokenExactInParams {
  /**
   * The amount of LRT to exit with.
   */
  amountIn: string | bigint;
  /**
   * The token to exit to.
   */
  tokenOut: OutputTokenMinOutWithUnwrap;
}

//#endregion
