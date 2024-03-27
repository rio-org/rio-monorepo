import { getAssetList } from '../lib/graphqlQueries';
import { BaseAssetDetails, BaseLRTSubgraphResponse } from '../lib/typings';
import { parseBaseSubgraphAssetList } from '../lib/utilities';
import {
  type UseQueryResult,
  type UseQueryOptions,
  useQuery
} from '@tanstack/react-query';
import { useSupportedChainId } from './useSupportedChainId';
import subgraphClient from '../lib/subgraphClient';
import { CHAIN_ID } from '../config';

const buildQueryFn = (chainId: number = CHAIN_ID) => {
  return async () => {
    const client = subgraphClient(chainId);
    const { data } = await client.query<{
      assets: BaseAssetDetails[];
      liquidRestakingTokens: BaseLRTSubgraphResponse[];
    }>({ query: getAssetList() });

    return parseBaseSubgraphAssetList(
      [data?.assets, data?.liquidRestakingTokens].filter(Boolean).flat()
    );
  };
};

export function useGetAssetsList(
  queryConfig?: Omit<
    UseQueryOptions<BaseAssetDetails[], Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseAssetDetails[], Error> {
  const chainId = useSupportedChainId();
  return useQuery<BaseAssetDetails[], Error>({
    queryKey: ['useGetAssetsList', chainId] as const,
    queryFn: buildQueryFn(chainId),
    staleTime: 60 * 1000,
    ...queryConfig,
    enabled: queryConfig?.enabled !== false
  });
}
