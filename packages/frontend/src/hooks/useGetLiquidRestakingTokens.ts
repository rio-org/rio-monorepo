import { LRTDetails, LRTSubgraphResponse } from '../lib/typings';
import { getLiquidRestakingTokenList } from '../lib/graphqlQueries';
import { parseSubgraphLRTList } from '../lib/utilities';
import subgraphClient from '../lib/subgraphClient';
import { CHAIN_ID } from '../../config';
import { useQuery, UseQueryOptions } from 'react-query';

const fetcher = async () => {
  const client = subgraphClient(CHAIN_ID);
  const { data } = await client.query<{
    liquidRestakingTokens: LRTSubgraphResponse[];
  }>({ query: getLiquidRestakingTokenList() });

  return parseSubgraphLRTList(data?.liquidRestakingTokens || []);
};

export function useGetLiquidRestakingTokens(
  queryConfig?: UseQueryOptions<LRTDetails[], Error>
) {
  return useQuery<LRTDetails[], Error>(
    ['useGetLiquidRestakingTokens', CHAIN_ID] as const,
    fetcher,
    {
      staleTime: 60 * 1000,
      ...queryConfig,
      enabled: queryConfig?.enabled !== false
    }
  );
}
