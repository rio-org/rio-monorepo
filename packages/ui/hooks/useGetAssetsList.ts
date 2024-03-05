import { getAssetList } from '../lib/graphqlQueries';
import { BaseAssetDetails, BaseLRTSubgraphResponse } from '../lib/typings';
import { parseBaseSubgraphAssetList } from '../lib/utilities';
import {
  type UseQueryResult,
  type UseQueryOptions,
  useQuery
} from '@tanstack/react-query';
import subgraphClient from '../lib/subgraphClient';
import { CHAIN_ID } from '../config';

const queryFn = async () => {
  const client = subgraphClient(CHAIN_ID);
  const { data } = await client.query<{
    assets: BaseAssetDetails[];
    liquidRestakingTokens: BaseLRTSubgraphResponse[];
  }>({ query: getAssetList() });

  return parseBaseSubgraphAssetList(
    [data?.assets, data?.liquidRestakingTokens].filter(Boolean).flat()
  );
};

export function useGetAssetsList(
  queryConfig?: Omit<
    UseQueryOptions<BaseAssetDetails[], Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseAssetDetails[], Error> {
  return useQuery<BaseAssetDetails[], Error>({
    queryKey: ['useGetAssetsList', CHAIN_ID] as const,
    queryFn,
    staleTime: 60 * 1000,
    ...queryConfig,
    enabled: queryConfig?.enabled !== false
  });
}
