import { buildRioSdkRestakingKey } from '../lib/utilities';
import { useQuery, UseQueryOptions } from 'react-query';
import { Operator, SubgraphClient, useSubgraph } from '@rionetwork/sdk-react';

function buildFetcherAndParser(
  subgraph: SubgraphClient,
  config?: Parameters<SubgraphClient['getOperators']>[0]
) {
  return async (): Promise<Operator[]> => {
    const operators = await subgraph.getOperators(config);
    return operators;
  };
}

export function useGetOperators(
  config?: Parameters<SubgraphClient['getOperators']>[0],
  queryConfig?: UseQueryOptions<Operator[], Error>
) {
  const subgraph = useSubgraph();
  return useQuery<Operator[], Error>(
    buildRioSdkRestakingKey('getOperators', config),
    buildFetcherAndParser(subgraph, config),
    {
      staleTime: 30 * 1000,
      ...queryConfig,
      enabled: queryConfig?.enabled !== false
    }
  );
}
