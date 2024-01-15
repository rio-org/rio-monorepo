import { OperationVariables, useQuery } from '@apollo/client';
import { LRTSubgraphResponse } from '../lib/typings';
import { getLiquidRestakingTokenList } from '../lib/graphqlQueries';
import { useMemo } from 'react';
import { parseSubgraphLRTList } from '../lib/utilities';

export const useGetLiquidRestakingTokens = (opts?: OperationVariables) => {
  const { data, ...rest } = useQuery<{
    liquidRestakingTokens: LRTSubgraphResponse[];
  }>(getLiquidRestakingTokenList(), {
    ...opts,
    pollInterval: opts?.pollInterval || 60000
  });

  const lrtDetails = useMemo(() => {
    if (!data?.liquidRestakingTokens) return undefined;
    return parseSubgraphLRTList(data.liquidRestakingTokens);
  }, [data?.liquidRestakingTokens]);

  return {
    data: lrtDetails,
    ...rest
  };
};
