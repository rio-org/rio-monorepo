import { buildRioSdkRestakingKey } from '../lib/utilities';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult
} from '@tanstack/react-query';
import {
  OperatorDelegator,
  SubgraphClient,
  useSubgraph
} from '@rionetwork/sdk-react';
import { useSupportedChainId } from './useSupportedChainId';

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
  const subgraph = useSubgraph();
  const chainId = useSupportedChainId();

  return useQuery<OperatorDelegator[], Error>({
    queryKey: buildRioSdkRestakingKey('getOperatorDelegators', chainId, config),
    queryFn: buildFetcherAndParser(subgraph, config),
    staleTime: 30 * 1000,
    ...queryConfig,
    enabled: queryConfig?.enabled !== false
  });
}
