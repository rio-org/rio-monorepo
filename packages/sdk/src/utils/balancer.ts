import { Address } from 'viem';
import { LiquidRestakingToken } from '../subgraph';

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
  const bptPerOne = BigInt(10_000); // Number of basis points in 100%
  const delta = (amount * slippage) / bptPerOne;

  return amount - delta;
};

/**
 * Get the expected amount of LRT with no price impact.
 * @param restakingToken The liquid restaking token.
 * @param tokenAmounts The token amounts (in units).
 */
// prettier-ignore
const getLRTZeroPriceImpact = (
  restakingToken: LiquidRestakingToken,
  tokenAmounts: (string | number)[]
): number => {
  if (tokenAmounts.length !== restakingToken.underlyingTokens.length) {
    throw new Error('Input length mismatch');
  }

  let lrtZeroPriceImpact = 0;
  for (let i = 0; i < tokenAmounts.length; i++) {
    const { weight, balance } = restakingToken.underlyingTokens[i];
    const price = (Number(weight) * Number(restakingToken.totalSupply)) / Number(balance);
    const newTerm = price * Number(tokenAmounts[i]);

    lrtZeroPriceImpact += newTerm;
  }
  return lrtZeroPriceImpact;
};

/**
 * Calculate the price impact of a join or exit.
 * @param restakingToken The liquid restaking token.
 * @param tokenAmounts The underlying token amounts (in units).
 * @param restakingTokenAmount The restaking token amount (in units).
 * @param isJoin Whether the transaction is a join or exit.
 */
export const calcPriceImpact = (
  restakingToken: LiquidRestakingToken,
  tokenAmounts: (string | number)[],
  restakingTokenAmount: string | number,
  isJoin: boolean
): number => {
  const lrtZeroPriceImpact = getLRTZeroPriceImpact(
    restakingToken,
    tokenAmounts
  );

  if (isJoin) {
    return Math.max(0, 1 - Number(restakingTokenAmount) / lrtZeroPriceImpact);
  }
  return Math.max(0, Number(restakingTokenAmount) / lrtZeroPriceImpact - 1);
};
