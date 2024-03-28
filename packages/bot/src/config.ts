import { Chain, goerli, holesky, mainnet } from 'viem/chains';
import dotenv from 'dotenv';

dotenv.config();

export const CHAIN_ID = parseInt(process.env.CHAIN_ID!) || 5;
export const RPC_URL = process.env.RPC_URL || (() => { throw new Error('No RPC URL provided'); })();
export const PRIVATE_KEY = (process.env.PRIVATE_KEY as `0x${string}`) || (() => { throw new Error('No private key provided'); })();

export const SUPPORTED_CHAIN: Record<number, Chain> = {
  1: mainnet,
  5: goerli,
  17000: holesky
};
