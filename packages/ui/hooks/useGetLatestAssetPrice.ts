import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery
} from '@tanstack/react-query';
import { Address } from 'viem';
import { getLatestAssetUSDPrice } from '../lib/graphqlQueries';
import { AssetDetails, AssetSubgraphResponse } from '../lib/typings';
import subgraphClient from '../lib/subgraphClient';
import { NATIVE_ETH_ADDRESS } from '../config';
import { parseSubgraphAsset } from '../lib/utilities';
import { useSupportedChainId } from './useSupportedChainId';

const fetcher = async ({
  chainId,
  tokenAddress = NATIVE_ETH_ADDRESS
}: {
  chainId: number;
  tokenAddress?: Address;
}) => {
  const { data } = await subgraphClient(chainId).query<{
    asset: AssetSubgraphResponse;
  }>({ query: getLatestAssetUSDPrice(tokenAddress) });
  return parseSubgraphAsset(data.asset);
};

export function useGetLatestAssetPrice(
  {
    tokenAddress,
    chainId: _chainId
  }: {
    tokenAddress?: Address;
    chainId?: number;
  },
  queryConfig?: Omit<
    UseQueryOptions<AssetDetails, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<AssetDetails> {
  const chainId = useSupportedChainId();
  return useQuery<AssetDetails, Error>({
    queryKey: ['useGetLatestAssetPrice', chainId, tokenAddress] as const,
    queryFn: () => fetcher({ tokenAddress, chainId }),
    staleTime: 60 * 1000,
    ...queryConfig,
    enabled: !!tokenAddress && queryConfig?.enabled !== false
  });
}
