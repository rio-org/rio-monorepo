import { Chain, goerli, holesky, mainnet } from 'viem/chains';
import dotenv from 'dotenv';
import { Address } from 'viem';

dotenv.config();

export const CHAIN_ID = parseInt(process.env.CHAIN_ID!) || 5;
export const RPC_URL = process.env.RPC_URL || (() => { throw new Error('No RPC URL provided'); })();
export const PRIVATE_KEY = (process.env.PRIVATE_KEY as `0x${string}`) || (() => { throw new Error('No private key provided'); })();
export const GUARDIAN_STUB_PRIVATE_KEY = (process.env.GUARDIAN_STUB_PRIVATE_KEY as `0x${string}`) || (() => { throw new Error('No guardian private key provided'); })();

export const SUPPORTED_CHAIN: Record<number, Chain> = {
  1: mainnet,
  5: goerli,
  17000: holesky
};

export const DEPOSIT_CONTRACTS_BY_CHAIN: Record<number, Address> = {
  1: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
  5: '0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b',
  17000: '0x4242424242424242424242424242424242424242'
};
