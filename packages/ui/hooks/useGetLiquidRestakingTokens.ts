import {
  useQuery,
  type UseQueryOptions,
  type UseBaseQueryResult
} from '@tanstack/react-query';
import { LRTDetails, LRTSubgraphResponse } from '../lib/typings';
import { getLiquidRestakingTokenList } from '../lib/graphqlQueries';
import { parseSubgraphLRTList } from '../lib/utilities';
import subgraphClient from '../lib/subgraphClient';
import { CHAIN_ID } from '../config';

const queryFn = async () => {
  const { data } = await subgraphClient(CHAIN_ID).query<{
    liquidRestakingTokens: LRTSubgraphResponse[];
  }>({ query: getLiquidRestakingTokenList() });
  return parseSubgraphLRTList(data?.liquidRestakingTokens || []);
};

export function useGetLiquidRestakingTokens(
  queryConfig?: Omit<
    UseQueryOptions<LRTDetails[], Error>,
    'queryKey' | 'queryFn'
  >
): UseBaseQueryResult<LRTDetails[], Error> {
  return useQuery<LRTDetails[], Error>({
    queryKey: ['useGetLiquidRestakingTokens', CHAIN_ID] as const,
    queryFn,
    staleTime: 60 * 1000,
    ...queryConfig
  });
}
