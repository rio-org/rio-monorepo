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
import { useAccountIfMounted } from './useAccountIfMounted';

const buildQueryFn = (chainId: number = CHAIN_ID) => {
  return async () => {
    const { data } = await subgraphClient(chainId).query<{
      liquidRestakingTokens: LRTSubgraphResponse[];
    }>({ query: getLiquidRestakingTokenList() });
    return parseSubgraphLRTList(data?.liquidRestakingTokens || []);
  };
};

export function useGetLiquidRestakingTokens(
  queryConfig?: Omit<
    UseQueryOptions<LRTDetails[], Error>,
    'queryKey' | 'queryFn'
  >
): UseBaseQueryResult<LRTDetails[], Error> {
  const { chain } = useAccountIfMounted();
  const chainId = chain?.id || CHAIN_ID;
  return useQuery<LRTDetails[], Error>({
    queryKey: ['useGetLiquidRestakingTokens', chainId] as const,
    queryFn: buildQueryFn(chainId),
    staleTime: 60 * 1000,
    ...queryConfig
  });
}
