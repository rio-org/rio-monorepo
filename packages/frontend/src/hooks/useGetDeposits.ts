import { buildRioSdkRestakingKey } from '../lib/utilities';
import { useQuery, UseQueryOptions } from 'react-query';
import { SubgraphClient, Deposit, useSubgraph } from '@rionetwork/sdk-react';

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
  queryConfig?: UseQueryOptions<Deposit[], Error>
) {
  const subgraph = useSubgraph();
  return useQuery<Deposit[], Error>(
    buildRioSdkRestakingKey('getDeposits', config),
    buildFetcherAndParser(subgraph, config),
    {
      staleTime: 60 * 1000,
      ...queryConfig,
      enabled:
        queryConfig?.enabled !== false &&
        (!config?.where ||
          !Object.values(config.where).some((v) => v === undefined))
    }
  );
}
