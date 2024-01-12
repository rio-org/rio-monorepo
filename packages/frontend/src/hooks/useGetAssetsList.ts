import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject
} from '@apollo/client';
import { getAssetList } from '../lib/graphqlQueries';
import {
  AssetDetails,
  AssetSubgraphResponse,
  CHAIN_ID_NUMBER
} from '../lib/typings';
import subgraphClient from '../lib/subgraphClient';
import { ASSET_LOGOS } from '../lib/constants';
import { zeroAddress } from 'viem';
import { ALLOW_ALL_LSTS, ASSET_SYMBOLS_ALLOWED } from '../../config';

const parseAssetList = (data: AssetSubgraphResponse[]): AssetDetails[] => {
  return data.map((asset) => {
    const assetDetails: AssetDetails = {
      name: asset.name,
      symbol: asset.symbol,
      address: asset.address || zeroAddress,
      logo: ASSET_LOGOS[asset.symbol],
      decimals: asset.decimals
    };
    return assetDetails;
  });
};

export const useGetAssetsList = async (chainId: CHAIN_ID_NUMBER) => {
  const client = subgraphClient(chainId);
  const getData = async (client: ApolloClient<NormalizedCacheObject>) => {
    const { data } = await client.query<{
      tokens: AssetSubgraphResponse[];
      liquidRestakingTokens: AssetSubgraphResponse[];
    }>({
      query: getAssetList()
    });
    return data;
  };

  const data: AssetDetails[] | ApolloError = await getData(client)
    .then((res) => {
      const completeAssetList = JSON.parse(
        JSON.stringify(
          parseAssetList(res.tokens.concat(res.liquidRestakingTokens))
        )
      ) as AssetDetails[];
      return ALLOW_ALL_LSTS
        ? completeAssetList
        : completeAssetList.filter(
            ({ symbol }) => ASSET_SYMBOLS_ALLOWED[symbol]
          );
    })
    .catch((err) => {
      console.log(err);
      return err as ApolloError;
    });

  return data;
};
