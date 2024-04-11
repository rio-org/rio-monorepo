import { Injectable } from '@nestjs/common';
import { Chain, createPublicClient, http as viemHttp } from 'viem';
import { CHAIN_ID } from '@rio-app/common';
import { goerli, holesky, mainnet } from 'viem/chains';

@Injectable()
export class ChainService {
  /**
   * Builds a chain client
   * @param chainId Chain id
   */
  chainClient(chainId: CHAIN_ID) {
    let chain: Chain;
    switch (chainId) {
      case CHAIN_ID.HOLESKY:
        chain = holesky;
        break;
      case CHAIN_ID.GOERLI:
        chain = goerli;
        break;
      case CHAIN_ID.ETHEREUM:
        chain = mainnet;
        break;
      default:
        throw 'Unsupported chain';
    }
    const rpcUrl = chain.rpcUrls.default.http[0];
    return createPublicClient({
      chain: chain,
      transport: viemHttp(rpcUrl),
      batch: { multicall: true },
    });
  }
}
