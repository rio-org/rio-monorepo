import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { PUBLIC_SUBGRAPH_URL } from './constants';
import { CHAIN_ID_NUMBER } from './typings';
import { getSubgraphUrlForChainOrThrow } from '@rionetwork/sdk-react';
import { CHAIN_ID } from '../config';

const subgraphClient = (chainId?: CHAIN_ID_NUMBER) => {
  let APIURL: string = '';

  try {
    APIURL = getSubgraphUrlForChainOrThrow(chainId ?? CHAIN_ID);
  } catch {
    APIURL = chainId ? PUBLIC_SUBGRAPH_URL[chainId] : '';
  }

  return new ApolloClient({
    link: createHttpLink({ uri: APIURL }),
    cache: new InMemoryCache()
  });
};

export default subgraphClient;
