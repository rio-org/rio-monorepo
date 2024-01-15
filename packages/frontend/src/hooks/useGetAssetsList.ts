import { OperationVariables, useQuery } from '@apollo/client';
import { getAssetList } from '../lib/graphqlQueries';
import { BaseAssetDetails, BaseLRTSubgraphResponse } from '../lib/typings';
import { useMemo } from 'react';
import { parseBaseSubgraphAssetList } from '../lib/utilities';

export const useGetAssetsList = (opts?: OperationVariables) => {
  const { data, ...rest } = useQuery<{
    assets: BaseAssetDetails[];
    liquidRestakingTokens: BaseLRTSubgraphResponse[];
  }>(getAssetList(), {
    ...opts,
    pollInterval: opts?.pollInterval || 60000 * 60
  });

  const baseAssetDetails = useMemo(() => {
    const { liquidRestakingTokens, assets } = data || {};
    if (!liquidRestakingTokens || !assets) return;
    return parseBaseSubgraphAssetList([...assets, ...liquidRestakingTokens]);
  }, [data?.liquidRestakingTokens, data?.assets]);

  return {
    data: baseAssetDetails,
    ...rest
  };
};
