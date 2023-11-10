import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { PUBLIC_SUBGRAPH_URL } from './constants';
import { CHAIN_ID_NUMBER } from './typings';

const subgraphClient = (chainId?: CHAIN_ID_NUMBER) => {
  const APIURL = chainId ? PUBLIC_SUBGRAPH_URL[chainId] : '';
  const link = createHttpLink({
    uri: APIURL
  });

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  });
};

export default subgraphClient;
