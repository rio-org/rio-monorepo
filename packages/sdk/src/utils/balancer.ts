import { Address } from 'viem';

/**
 * All possible Balancer weighted pool join kinds.
 */
export enum WeightedPoolJoinKind {
  INIT = 0,
  EXACT_TOKENS_IN_FOR_BPT_OUT,
  TOKEN_IN_FOR_EXACT_BPT_OUT,
  ALL_TOKENS_IN_FOR_EXACT_BPT_OUT
}

/**
 * All possible Balancer weighted pool exit kinds.
 */
export enum WeightedPoolExitKind {
  EXACT_BPT_IN_FOR_ONE_TOKEN_OUT = 0,
  EXACT_BPT_IN_FOR_TOKENS_OUT,
  BPT_IN_FOR_EXACT_TOKENS_OUT
}

/**
 * Addresses of the `BalancerHelpers` contract on each network.
 */
export const BALANCER_HELPERS_ADDRESS: Record<number, Address> = {
  [5]: '0x5aDDCCa35b7A0D07C74063c48700C8590E87864E'
};

/**
 * Convert a Balancer pool ID to a pool address.
 * @param poolId The Balancer pool ID.
 */
export const toPoolAddress = (poolId: string) => poolId.slice(0, 42);

/**
 * Reduce the input amount by the slippage factor.
 * @param amount The unit amount (not parsed)
 * @param slippage The slippage value in BPT - i.e. 50 = 0.5%
 */
export const subtractSlippage = (amount: bigint, slippage: bigint): bigint => {
  const bptPerOne = BigInt(10000); // Number of basis points in 100%
  const delta = (amount * slippage) / bptPerOne;

  return amount - delta;
};
