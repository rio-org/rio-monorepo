import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject
} from '@apollo/client';
import { getLiquidRestakingTokenList } from './graphqlQueries';
import { CHAIN_ID_NUMBER, LRTDetails, LRTSubgraphResponse } from './typings';
import subgraphClient from './subgraphClient';
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
    .then((res) => parseSubgraphLRTList(res.liquidRestakingTokens))
    .catch((err) => {
      console.log(err);
      error = err as ApolloError;
      return [];
    });

  return { data, error };
};
