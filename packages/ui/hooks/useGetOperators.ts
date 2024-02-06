import { buildRioSdkRestakingKey } from '../lib/utilities';
import { useQuery, UseQueryOptions } from 'react-query';
import {
  OperatorDelegator,
  SubgraphClient,
  useSubgraph
} from '@rionetwork/sdk-react';

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
  queryConfig?: UseQueryOptions<OperatorDelegator[], Error>
) {
  const subgraph = useSubgraph();
  return useQuery<OperatorDelegator[], Error>(
    buildRioSdkRestakingKey('getOperatorDelegators', config),
    buildFetcherAndParser(subgraph, config),
    {
      staleTime: 30 * 1000,
      ...queryConfig,
      enabled: queryConfig?.enabled !== false
    }
  );
}
