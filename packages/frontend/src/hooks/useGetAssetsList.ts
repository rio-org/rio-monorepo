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

const parseAssetList = (data: AssetSubgraphResponse[]): AssetDetails[] => {
  return data.map((asset) => {
    const assetDetails: AssetDetails = {
      name: asset.name,
      symbol: asset.symbol,
      address: asset.address || zeroAddress,
      logo: ASSET_LOGOS[asset.symbol]
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
      console.log(res.tokens);
      return JSON.parse(
        JSON.stringify(
          parseAssetList(res.tokens.concat(res.liquidRestakingTokens))
        )
      ) as AssetDetails[];
    })
    .catch((err) => {
      console.log(err);
      return err as ApolloError;
    });

  return data;
};
