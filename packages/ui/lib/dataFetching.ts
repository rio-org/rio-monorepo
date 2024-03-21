import {
  type ApolloClient,
  type ApolloError,
  type NormalizedCacheObject
} from '@apollo/client';
import { getLiquidRestakingTokenList } from './graphqlQueries';
import { type LRTDetails, type LRTSubgraphResponse } from './typings';
import { parseSubgraphLRTList } from './utilities';
import subgraphClient from './subgraphClient';

export const fetchLiquidRestakingTokens = async (chainId: number) => {
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
