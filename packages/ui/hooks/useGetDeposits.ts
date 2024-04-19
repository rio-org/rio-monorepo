import { buildRioSdkRestakingKey } from '../lib/utilities';
import { SubgraphClient, Deposit } from '@rionetwork/sdk-react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult
} from '@tanstack/react-query';
import { useSupportedChainId } from './useSupportedChainId';
import { SUBGRAPH_API_KEY } from '../config';

function buildFetcherAndParser(
  subgraph: SubgraphClient,
  config?: Parameters<SubgraphClient['getDeposits']>[0]
) {
  return async (): Promise<Deposit[]> => {
    const deposits = await subgraph.getDeposits(config);
    return deposits;
  };
}

export function useGetDeposits(
  config?: Parameters<SubgraphClient['getDeposits']>[0],
  queryConfig?: Omit<UseQueryOptions<Deposit[], Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<Deposit[], Error> {
  const chainId = useSupportedChainId();
  const subgraph = SubgraphClient.for(chainId, {
    subgraphApiKey: SUBGRAPH_API_KEY
  });
  return useQuery<Deposit[], Error>({
    queryKey: buildRioSdkRestakingKey('getDeposits', chainId, config),
    queryFn: buildFetcherAndParser(subgraph, config),
    staleTime: 60 * 1000,
    ...queryConfig,
    enabled:
      queryConfig?.enabled !== false &&
      (!config?.where ||
        !Object.values(config.where).some((v) => v === undefined))
  });
}
