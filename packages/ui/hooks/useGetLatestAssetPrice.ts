import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject
} from '@apollo/client';
import { getLatestAssetUSDPrice } from '../lib/graphqlQueries';
import { AssetPrice, CHAIN_ID_NUMBER } from '../lib/typings';
import { useEffect, useState } from 'react';
import subgraphClient from '../lib/subgraphClient';
import { Address } from 'viem';

export const useGetLatestAssetPrice = (
  tokenAddress: Address,
  chainId: CHAIN_ID_NUMBER
) => {
  const client = subgraphClient(chainId);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<ApolloError>();
  const [data, setData] = useState<AssetPrice>();

  const getData = async (client: ApolloClient<NormalizedCacheObject>) => {
    const { data } = await client.query<{
      token: AssetPrice;
    }>({
      query: getLatestAssetUSDPrice(tokenAddress)
    });
    return data.token;
  };

  useEffect(() => {
    if (!chainId) return;
    getData(client)
      .then((data) => {
        if (!data) return;
        setIsLoading(false);
        setData(data);
      })
      .catch((error: ApolloError) => {
        if (!error) return;
        setIsError(error);
        setIsLoading(false);
      });
  }, [chainId]);

  return {
    data,
    isLoading,
    isError
  };
};
