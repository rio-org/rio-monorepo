import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { PUBLIC_SUBGRAPH_URL } from './constants';
import { getSubgraphUrlForChainOrThrow } from '@rionetwork/sdk-react';
import { CHAIN_ID } from '../config';

const subgraphClient = (chainId?: number) => {
  let APIURL: string = '';

  try {
    APIURL = getSubgraphUrlForChainOrThrow(chainId ?? CHAIN_ID);
  } catch {
    APIURL = chainId
      ? PUBLIC_SUBGRAPH_URL[chainId as keyof typeof PUBLIC_SUBGRAPH_URL]
      : '';
  }

  return new ApolloClient({
    link: createHttpLink({ uri: APIURL }),
    cache: new InMemoryCache()
  });
};

export default subgraphClient;
