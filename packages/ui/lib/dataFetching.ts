import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject
} from '@apollo/client';
import { getLiquidRestakingTokenList } from './graphqlQueries';
import { CHAIN_ID_NUMBER, LRTDetails, LRTSubgraphResponse } from './typings';
import subgraphClient from './subgraphClient';
import { ALLOW_ALL_LSTS, ASSET_SYMBOLS_ALLOWED } from '../config';
import { parseSubgraphLRTList } from './utilities';

export const fetchLiquidRestakingTokens = async (chainId: CHAIN_ID_NUMBER) => {
  const client = subgraphClient(chainId);
  const getData = async (client: ApolloClient<NormalizedCacheObject>) => {
    const { data } = await client.query<{
      liquidRestakingTokens: LRTSubgraphResponse[];
    }>({
      query: getLiquidRestakingTokenList()
    });
    return data;
  };

  let error: ApolloError | null = null;

  const data: LRTDetails[] = await getData(client)
    .then((res) => {
      const lrtList = parseSubgraphLRTList(res.liquidRestakingTokens);
      return ALLOW_ALL_LSTS
        ? lrtList
        : lrtList.map((lrt) => ({
            ...lrt,
            underlyingAssets: lrt.underlyingAssets.filter(
              (ua) => ASSET_SYMBOLS_ALLOWED[ua.asset.symbol]
            )
          }));
    })
    .catch((err) => {
      console.log(err);
      error = err as ApolloError;
      return [];
    });

  return { data, error };
};
