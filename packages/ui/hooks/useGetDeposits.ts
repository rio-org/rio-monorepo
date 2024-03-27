import { buildRioSdkRestakingKey } from '../lib/utilities';
import { SubgraphClient, Deposit, useSubgraph } from '@rionetwork/sdk-react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult
} from '@tanstack/react-query';
import { useConfig } from 'wagmi';
import { useAccountIfMounted } from './useAccountIfMounted';

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
  const subgraph = useSubgraph();
  const { chain } = useAccountIfMounted();
  const { chains } = useConfig();
  const chainId = (chains.find((c) => c.id === chain?.id) || chains[0]).id;

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
