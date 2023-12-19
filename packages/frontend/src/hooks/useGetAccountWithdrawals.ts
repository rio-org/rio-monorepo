import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject
} from '@apollo/client';
import { getUserExits } from '../lib/graphqlQueries';
import {
  EthereumAddress,
  ExitSubgraphResponse,
  TransactionStatus,
  WithdrawEvent
} from '../lib/typings';
import subgraphClient from '../lib/subgraphClient';
import { CHAIN_ID } from '../../config';
import { useEffect, useState } from 'react';
import { dateFromTimestamp } from '../lib/utilities';

const parseExits = (data: ExitSubgraphResponse[]): WithdrawEvent[] => {
  const sorted = [...data].sort((a, b) => {
    return +b.timestamp - +a.timestamp;
  });
  return sorted.map((event) => {
    console.log('event', event);
    return {
      date: dateFromTimestamp(+event.timestamp),
      status: 'Claimed' as TransactionStatus, // TODO: "Claimed" hardcoded for now. need to adjust when request > claim > available process is supported
      symbol: event.tokensOut[0].symbol,
      amount: +event.amountsOut[0], // TODO: need to adjust when multiple tokens are supported
      tx: event.tx
    };
  });
};

export const useGetAccountWithdrawals = (address: EthereumAddress) => {
  const chainId = CHAIN_ID;
  const client = subgraphClient(chainId);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<ApolloError>();
  const [data, setData] = useState<WithdrawEvent[]>();
  const getData = async (client: ApolloClient<NormalizedCacheObject>) => {
    const { data } = await client.query<{
      exits: ExitSubgraphResponse[];
    }>({
      query: getUserExits(address)
    });
    return data;
  };

  useEffect(() => {
    if (!chainId) return;
    getData(client)
      .then((data) => {
        if (!data) return;
        setIsLoading(false);
        setData(parseExits(data.exits));
      })
      .catch((error: ApolloError) => {
        if (!error) return;
        setIsError(error);
        setIsLoading(false);
      });
  }, [chainId]);

  return {
    data,
    isLoading,
    isError
  };
};
