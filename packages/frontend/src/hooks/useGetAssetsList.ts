import { getAssetList } from '../lib/graphqlQueries';
import { BaseAssetDetails, BaseLRTSubgraphResponse } from '../lib/typings';
import { parseBaseSubgraphAssetList } from '../lib/utilities';
import { UseQueryOptions, useQuery } from 'react-query';
import subgraphClient from '../lib/subgraphClient';
import { CHAIN_ID } from '../../config';

const fetcher = async () => {
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
  queryConfig?: UseQueryOptions<BaseAssetDetails[], Error>
) {
  return useQuery<BaseAssetDetails[], Error>(
    ['useGetAssetsList', CHAIN_ID] as const,
    fetcher,
    {
      staleTime: 60 * 1000,
      ...queryConfig,
      enabled: queryConfig?.enabled !== false
    }
  );
}
