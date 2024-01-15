import { OperationVariables, useQuery } from '@apollo/client';
import { LRTDetails } from '../lib/typings';
import { getLiquidRestakingTokenList } from '../lib/graphqlQueries';

export const useGetLiquidRestakingTokens = (opts?: OperationVariables) => {
  const { data, ...rest } = useQuery<{
    liquidRestakingTokens: LRTDetails[];
  }>(getLiquidRestakingTokenList(), {
    ...opts,
    pollInterval: opts?.pollInterval || 30000
  });

  return {
    data: data?.liquidRestakingTokens,
    ...rest
  };
};
