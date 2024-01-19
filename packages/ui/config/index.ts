import { CHAIN_ID_NUMBER } from '../lib/typings';
import { getAddress } from 'viem';

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
  ? (parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) as CHAIN_ID_NUMBER)
  : (5 as CHAIN_ID_NUMBER);

// Temporary so that the UI correctly switches between states for
// single asset (only ETH) or multi asset (ETH + LSTs)
export const ALLOW_ALL_LSTS = false;
export const ASSET_SYMBOLS_ALLOWED: { [symbol: string]: boolean | undefined } =
  {
    ETH: true,
    WETH: true,
    reETH: true
  };

// We internally use this instead of the zero address when referencing native ETH
export const NATIVE_ETH_ADDRESS = getAddress(
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
);
