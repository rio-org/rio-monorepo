import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject
} from '@apollo/client';
import { getLiquidRestakingTokenList } from '../lib/graphqlQueries';
import {
  CHAIN_ID_NUMBER,
  LRTDetails,
  LRTSubgraphResponse
} from '../lib/typings';
import subgraphClient from '../lib/subgraphClient';
import { ALLOW_ALL_LSTS, ASSET_SYMBOLS_ALLOWED } from '../../config';
import { parseSubgraphLRTList } from '../lib/utilities';

export const useGetLiquidRestakingTokens = async (chainId: CHAIN_ID_NUMBER) => {
  const client = subgraphClient(chainId);
  const getData = async (client: ApolloClient<NormalizedCacheObject>) => {
    const { data } = await client.query<{
      liquidRestakingTokens: LRTSubgraphResponse[];
    }>({
      query: getLiquidRestakingTokenList()
    });
    return data;
  };

  const data: LRTDetails[] | ApolloError = await getData(client)
    .then((res) => {
      const lrtList = parseSubgraphLRTList(res.liquidRestakingTokens);
      return ALLOW_ALL_LSTS
        ? lrtList
        : lrtList.map((lrt) => ({
            ...lrt,
            underlyingTokens: lrt.underlyingTokens.filter(
              (ut) => ASSET_SYMBOLS_ALLOWED[ut.token.symbol]
            )
          }));
    })
    .catch((err) => {
      console.log(err);
      return err as ApolloError;
    });

  return data;
};
