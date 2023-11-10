import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject
} from '@apollo/client';
import { getProposalsByDao } from '../lib/graphqlQueries';
import { CHAIN_ID_NUMBER, EthereumAddress, Proposal } from '../lib/typings';
import { useEffect, useState } from 'react';
import apolloClient from '../lib/apolloClient';

export const useGetProposals = (
  collectionAddress: EthereumAddress,
  chainId: CHAIN_ID_NUMBER,
  amount: number = 100
) => {
  const client = apolloClient(chainId);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<ApolloError>();
  const [data, setData] = useState<Proposal[]>();

  const getData = async (client: ApolloClient<NormalizedCacheObject>) => {
    const { data: subgraphData } = await client.query<{
      proposals: Proposal[];
    }>({
      query: getProposalsByDao(collectionAddress, amount)
    });
    return subgraphData.proposals;
  };

  useEffect(() => {
    if (!collectionAddress || !chainId) return;
    getData(client)
      .then((data) => {
        if (!data) return;
        setIsLoading(false);
        setData(data);
      })
      .catch((error: ApolloError) => {
        if (!error) return;
        setIsError(error);
        setIsLoading(false);
      });
  }, [collectionAddress, chainId]);

  return {
    data,
    isLoading,
    isError
  };
};
