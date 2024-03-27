import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult
} from '@tanstack/react-query';
import {
  SubgraphClient,
  WithdrawalClaim,
  useSubgraph
} from '@rionetwork/sdk-react';
import { buildRioSdkRestakingKey } from '../lib/utilities';
import { useSupportedChainId } from './useSupportedChainId';

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
  queryConfig?: Omit<
    UseQueryOptions<WithdrawalClaim[], Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<WithdrawalClaim[], Error> {
  const subgraph = useSubgraph();
  const chainId = useSupportedChainId();

  return useQuery<WithdrawalClaim[], Error>({
    queryKey: buildRioSdkRestakingKey('getWithdrawalClaims', chainId, config),
    queryFn: buildFetcherAndParser(subgraph, config),
    staleTime: 30 * 1000,
    ...queryConfig,
    enabled:
      queryConfig?.enabled !== false &&
      (!config?.where ||
        !Object.values(config.where).some((v) => v === undefined))
  });
}
