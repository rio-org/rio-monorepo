import {
  ApolloClient,
  ApolloError,
  NormalizedCacheObject
} from '@apollo/client';
import { getUserTxHistory } from '../lib/graphqlQueries';
import {
  EthereumAddress,
  TransactionEvent,
  TransactionEventSubgraphResponse,
  TransactionType
} from '../lib/typings';
import subgraphClient from '../lib/subgraphClient';
import { CHAIN_ID } from '../../config';
import { useEffect, useState } from 'react';
import { dateFromTimestamp, displayEthAmount } from '../lib/utilities';

const parseTxs = (data: {
  joins: TransactionEventSubgraphResponse[];
  exits: TransactionEventSubgraphResponse[];
}): TransactionEvent[] => {
  const joins = data.joins.map((join) => {
    return {
      ...join,
      type: 'Deposit'
    };
  });
  const exits = data.exits.map((exit) => {
    return {
      ...exit,
      type: 'Withdrawal'
    };
  });
  const allTxs = [...joins, ...exits].sort((a, b) => {
    return +b.timestamp - +a.timestamp;
  });

  return allTxs.map((event) => {
    let amount = event.amountIn ? event.amountIn : '0';
    if (event.type === 'Deposit') {
      amount = event.amountsIn ? event.amountsIn[0] : '0';
    }
    return {
      date: dateFromTimestamp(+event.timestamp),
      tx: event.tx,
      type: event.type as TransactionType,
      historicalReEthPrice: +event.valueUSD || 2200,
      amountReEth: displayEthAmount(amount),
      balance: displayEthAmount(event.userBalanceAfter)
    };
  });
};

const parsePaginatedResults = (
  data: TransactionEvent[],
  skip: number,
  resultsPerPage: number
) => {
  return data.slice(skip, skip + resultsPerPage);
};

export const useGetAccountTxHistory = (
  address: EthereumAddress,
  resultsPerPage: number,
  page: number
) => {
  const chainId = CHAIN_ID;
  const client = subgraphClient(chainId);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<ApolloError>();
  const [data, setData] = useState<TransactionEvent[]>();
  const [paginatedResults, setPaginatedResults] = useState<TransactionEvent[]>(
    []
  );
  const [pageCount, setPageCount] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const skip = page * resultsPerPage;

  const getData = async (client: ApolloClient<NormalizedCacheObject>) => {
    // fetch all user's joins and exits in order to get total count for pagination and to sort by timestamp
    const { data } = await client.query<{
      joins: TransactionEventSubgraphResponse[];
      exits: TransactionEventSubgraphResponse[];
    }>({
      query: getUserTxHistory(address)
    });
    return data;
  };

  useEffect(() => {
    if (!chainId) return;
    getData(client)
      .then((data) => {
        if (!data) return;
        setIsLoading(false);
        const txs = parseTxs(data);
        setData(txs);
        setPageCount(Math.round(txs.length / resultsPerPage));
      })
      .catch((error: ApolloError) => {
        if (!error) return;
        setIsError(error);
        setIsLoading(false);
      });
  }, [chainId, page]);

  useEffect(() => {
    if (!data) return;
    setPaginatedResults(parsePaginatedResults(data, skip, resultsPerPage));
    if (skip + resultsPerPage < data.length) {
      setHasNextPage(true);
    } else {
      setHasNextPage(false);
    }
  }, [data, skip]);

  return {
    data: paginatedResults,
    pageCount,
    hasNextPage,
    isLoading,
    isError
  };
};
