import { UseQueryOptions, useQuery } from 'react-query';
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
  queryConfig?: UseQueryOptions<AssetDetails, Error>
) {
  return useQuery<AssetDetails, Error>(
    ['useGetLatestAssetPrice', chainId, tokenAddress] as const,
    () => fetcher({ tokenAddress, chainId }),
    {
      staleTime: 60 * 1000,
      ...queryConfig,
      enabled: !!tokenAddress && queryConfig?.enabled !== false
    }
  );
}
