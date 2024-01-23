import { buildRioSdkRestakingKey } from '../lib/utilities';
import { useQuery, UseQueryOptions } from 'react-query';
import {
  SubgraphClient,
  WithdrawalClaim,
  useSubgraph
} from '@rionetwork/sdk-react';

function buildFetcherAndParser(
  subgraph: SubgraphClient,
  config?: Parameters<SubgraphClient['getWithdrawalClaims']>[0]
) {
  return async (): Promise<WithdrawalClaim[]> => {
    const withdrawalClaims = await subgraph.getWithdrawalClaims(config);
    return withdrawalClaims;
  };
}

export function useGetWithdrawalClaims(
  config?: Parameters<SubgraphClient['getWithdrawalClaims']>[0],
  queryConfig?: UseQueryOptions<WithdrawalClaim[], Error>
) {
  const subgraph = useSubgraph();
  return useQuery<WithdrawalClaim[], Error>(
    buildRioSdkRestakingKey('getWithdrawalClaims', config),
    buildFetcherAndParser(subgraph, config),
    {
      staleTime: 30 * 1000,
      ...queryConfig,
      enabled:
        queryConfig?.enabled !== false &&
        (!config?.where ||
          !Object.values(config.where).some((v) => v === undefined))
    }
  );
}
