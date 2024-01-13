import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject
} from '@apollo/client';
import { getLiquidRestakingTokenListWithFinancials } from '../lib/graphqlQueries';
import {
  CHAIN_ID_NUMBER,
  LRTDetailsWithFinancials,
  LRTSubgraphResponseWithFinancials
} from '../lib/typings';
import subgraphClient from '../lib/subgraphClient';
import { ALLOW_ALL_LSTS, ASSET_SYMBOLS_ALLOWED } from '../../config';
import { parseSubgraphLRTList } from '../lib/utilities';

export const useGetLRTsWithFinancials = async (chainId: CHAIN_ID_NUMBER) => {
  const client = subgraphClient(chainId);
  const getData = async (client: ApolloClient<NormalizedCacheObject>) => {
    const { data } = await client.query<{
      liquidRestakingTokens: LRTSubgraphResponseWithFinancials[];
    }>({
      query: getLiquidRestakingTokenListWithFinancials()
    });
    return data;
  };

  const data: LRTDetailsWithFinancials[] | ApolloError = await getData(client)
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
      return err as ApolloError;
    });

  return data;
};
