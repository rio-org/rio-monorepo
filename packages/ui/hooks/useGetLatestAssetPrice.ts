import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery
} from '@tanstack/react-query';
import { Address } from 'viem';
import { getLatestAssetUSDPrice } from '../lib/graphqlQueries';
import {
  AssetDetails,
  AssetSubgraphResponse,
  CHAIN_ID_NUMBER
} from '../lib/typings';
import subgraphClient from '../lib/subgraphClient';
import { CHAIN_ID, NATIVE_ETH_ADDRESS } from '../config';
import { parseSubgraphAsset } from '../lib/utilities';

const fetcher = async ({
  tokenAddress = NATIVE_ETH_ADDRESS,
  chainId = CHAIN_ID
}: {
  tokenAddress?: Address;
  chainId?: CHAIN_ID_NUMBER;
}) => {
  const { data } = await subgraphClient(chainId).query<{
    asset: AssetSubgraphResponse;
  }>({ query: getLatestAssetUSDPrice(tokenAddress) });
  return parseSubgraphAsset(data.asset);
};

export function useGetLatestAssetPrice(
  {
    tokenAddress,
    chainId = CHAIN_ID
  }: {
    tokenAddress?: Address;
    chainId?: CHAIN_ID_NUMBER;
  },
  queryConfig?: Omit<
    UseQueryOptions<AssetDetails, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<AssetDetails> {
  return useQuery<AssetDetails, Error>({
    queryKey: ['useGetLatestAssetPrice', chainId, tokenAddress] as const,
    queryFn: () => fetcher({ tokenAddress, chainId }),
    staleTime: 60 * 1000,
    ...queryConfig,
    enabled: !!tokenAddress && queryConfig?.enabled !== false
  });
}
