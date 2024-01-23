import { SubgraphClient } from '@rionetwork/sdk';
import { CHAIN_ID, PRIVATE_KEY, SUPPORTED_CHAIN } from './config';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { Rebalancer } from './processes';

// prettier-ignore
const publicClient = createPublicClient({
  chain: SUPPORTED_CHAIN[CHAIN_ID] || (() => { throw new Error('Invalid chain ID'); })(),
  transport: http()
});
const account = privateKeyToAccount(PRIVATE_KEY);
const walletClient = createWalletClient({
  chain: publicClient.chain,
  transport: http(),
  account
});
const subgraph = new SubgraphClient(CHAIN_ID);

const run = async () => {
  const tokens = await subgraph.getLiquidRestakingTokens();

  // Start supported processes for each token.
  for (const token of tokens) {
    const rebalancer = new Rebalancer({
      publicClient,
      walletClient,
      token
    });
    rebalancer.start();
  }
};
run();
