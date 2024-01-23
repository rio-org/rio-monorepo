import { SubgraphClient } from '@rionetwork/sdk';
import { CHAIN_ID, PRIVATE_KEY, SUPPORTED_CHAIN } from './config';
import { createPublicClient, createWalletClient, http } from 'viem';
import { IProcess, RebalanceProcess } from './processes';
import { privateKeyToAccount } from 'viem/accounts';

//#region Client Setup

const subgraph = new SubgraphClient(CHAIN_ID);

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

//#endregion

//#region Process Setup/Teardown

const processes: IProcess[] = [];
const run = async () => {
  const tokens = await subgraph.getLiquidRestakingTokens();

  // Start supported processes for each token.
  for (const token of tokens) {
    processes.push(
      new RebalanceProcess({
        publicClient,
        walletClient,
        token
      })
    );
  }
  processes.forEach((process) => process.start());
};
void run();

process.on('SIGINT', () => {
  processes.forEach((process) => process.stop());
  process.exit(0);
});

//#endregion
