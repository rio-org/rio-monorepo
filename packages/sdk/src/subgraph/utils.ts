import { OrderDirection } from './generated/graphql';
import { QueryConfig } from './types';
import { goerli, holesky } from 'viem/chains';

/**
 * Builds the Subgraph URLs for the known chains.
 * More Subgraph URLs are available if a Graph API key is provided.
 * @param _subgraphApiKey The Graph API key to use for the Subgraph (optional).
 */
export const getSubgraphUrls = (
  // Kept for future use.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _subgraphApiKey?: string
): Record<number, string> =>
  Object.assign(
    {
      [goerli.id]:
        'https://api.thegraph.com/subgraphs/name/rio-org/rio-network-goerli-v2'
    },
    {
      [holesky.id]:
        'https://api.goldsky.com/api/public/project_clsc2dwnz018t01ubfw0idj8d/subgraphs/rio-network-holesky/prod/gn'
    }
  );

/**
 * Get the Subgraph URL for the provided chain ID.
 * Throws if there is no known Subgraph on the corresponding chain.
 * @param chainId The desired chainId.
 * @param subgraphApiKey The API key to use for the Subgraph (optional).
 */
export const getSubgraphUrlForChainOrThrow = (
  chainId: number,
  subgraphApiKey?: string
) => {
  const subgraphUrls = getSubgraphUrls(subgraphApiKey);
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
