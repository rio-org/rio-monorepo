import { Injectable } from '@nestjs/common';
import {
  Chain,
  createPublicClient,
  http as viemHttp,
  PublicClient,
} from 'viem';
import { CHAIN_ID, SUPPORTED_CHAIN_IDS } from '@rio-app/common';
import { goerli, holesky, mainnet } from 'viem/chains';

@Injectable()
export class ChainService {
  public chainIds = SUPPORTED_CHAIN_IDS;
  public chainNames = SUPPORTED_CHAIN_IDS.map((id) => CHAIN_ID[id]);

  /**
   * Builds a chain client
   * @param chainId Chain id
   */
  chainClient(chainId: CHAIN_ID): PublicClient<any> {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return createPublicClient({
      chain: chain,
      transport: viemHttp(rpcUrl),
      batch: { multicall: true },
    });
  }
}
