import { http, createPublicClient } from 'viem';
import { CHAIN_ID_NUMBER } from './typings';
import { getAlchemyChainLabel } from './utilities';
import { mainnet, sepolia } from 'wagmi';
import {
  base,
  baseGoerli,
  goerli,
  hardhat,
  optimism,
  optimismGoerli,
  zora,
  zoraTestnet
} from 'viem/chains';

const chains = {
  1: mainnet,
  5: goerli,
  11155111: sepolia,
  10: optimism,
  420: optimismGoerli,
  8453: base,
  84531: baseGoerli,
  31337: hardhat,
  7777777: zora,
  999: zoraTestnet
};

export const viemClient = (chainId: CHAIN_ID_NUMBER) => {
  const transport = http(
    `https://${getAlchemyChainLabel(chainId)}.g.alchemy.com/v2/${
      process.env.NEXT_PUBLIC_ALCHEMY_ID
    }`
  );
  return createPublicClient({
    chain: chains[chainId],
    transport
  });
};
