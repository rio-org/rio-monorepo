import { OrderDirection } from './generated/graphql';
import { QueryConfig } from './types';
import { goerli, holesky } from 'viem/chains';

/**
 * Builds the Subgraph URLs for the known chains.
 * More Subgraph URLs are available if a Graph API key is provided.
 * @param graphApiKey The Graph API key to use for the Subgraph (optional).
 */
export const getSubgraphUrls = (graphApiKey?: string): Record<number, string> =>
  Object.assign(
    {
      [goerli.id]:
        'https://api.thegraph.com/subgraphs/name/rio-org/rio-network-goerli-v2'
    },
    graphApiKey && {
      [holesky.id]: `https://gateway-arbitrum.network.thegraph.com/api/${graphApiKey}/subgraphs/id/6tW7q8VAepsuJksDuLTzzgRHzegW2z1dmpcmtNE6G2A4`
    }
  );

/**
 * Get the Subgraph URL for the provided chain ID.
 * Throws if there is no known Subgraph on the corresponding chain.
 * @param chainId The desired chainId.
 * @param graphApiKey The Graph API key to use for the Subgraph (optional).
 */
export const getSubgraphUrlForChainOrThrow = (
  chainId: number,
  graphApiKey?: string
) => {
  const subgraphUrls = getSubgraphUrls(graphApiKey);
  if (!subgraphUrls[chainId]) {
    throw new Error(
      `Unknown chain id (${chainId}). No Subgraph exists for this chain.`
    );
  }
  return subgraphUrls[chainId];
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
