import { buildRioSdkRestakingKey } from '../lib/utilities';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult
} from '@tanstack/react-query';
import {
  OperatorDelegator,
  SubgraphClient,
} from '@rionetwork/sdk-react';
import { useSupportedChainId } from './useSupportedChainId';
import { SUBGRAPH_API_KEY } from '../config';

function buildFetcherAndParser(
  subgraph: SubgraphClient,
  config?: Parameters<SubgraphClient['getOperatorDelegators']>[0]
) {
  return async (): Promise<OperatorDelegator[]> => {
    const operatorDelegator = await subgraph.getOperatorDelegators(config);
    return operatorDelegator;
  };
}

export function useGetOperators(
  config?: Parameters<SubgraphClient['getOperatorDelegators']>[0],
  queryConfig?: Partial<
    Omit<UseQueryOptions<OperatorDelegator[], Error>, 'queryKey' | 'queryFn'>
  >
): UseQueryResult<OperatorDelegator[], Error> {
  const chainId = useSupportedChainId();
  const subgraph = SubgraphClient.for(chainId, { subgraphApiKey: SUBGRAPH_API_KEY });

  return useQuery<OperatorDelegator[], Error>({
    queryKey: buildRioSdkRestakingKey('getOperatorDelegators', chainId, config),
    queryFn: buildFetcherAndParser(subgraph, config),
    staleTime: 30 * 1000,
    ...queryConfig,
    enabled: queryConfig?.enabled !== false
  });
}
