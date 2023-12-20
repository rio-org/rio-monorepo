import { OrderDirection } from './generated/graphql';
import { QueryConfig } from './types';
import { goerli } from 'viem/chains';

export const SUBGRAPH_URLS: Record<number, string> = {
  [goerli.id]:
    'https://api.thegraph.com/subgraphs/name/rio-org/rio-network-goerli'
};

/**
 * Get the Subgraph URL for the provided chain ID.
 * Throws if there is no known Subgraph on the corresponding chain.
 * @param chainId The desired chainId.
 */
export const getSubgraphUrlForChainOrThrow = (chainId: number) => {
  if (!SUBGRAPH_URLS[chainId]) {
    throw new Error(
      `Unknown chain id (${chainId}). No Subgraph exists for this chain.`
    );
  }
  return SUBGRAPH_URLS[chainId];
};

/**
 * Get the default request config when querying for many items.
 * @param orderBy Which field to order the results by.
 */
export const getDefaultConfig = <OB>(orderBy: OB) => ({
  page: 1,
  perPage: 50,
  orderBy: orderBy,
  orderDirection: OrderDirection.Desc
});

/**
 * Convert the raw query config to a paginated query config.
 * @param config The query config.
 */
export const toPaginated = <OB, W>(config: QueryConfig<OB, W>) => ({
  first: config.perPage,
  skip: (config.page - 1) * config.perPage,
  orderBy: config.orderBy,
  orderDirection: config.orderDirection,
  where: config.where
});
