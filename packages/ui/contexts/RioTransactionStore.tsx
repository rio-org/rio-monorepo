import { Hash } from '@wagmi/core';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useChainId, useWaitForTransaction } from 'wagmi';
import { CHAIN_ID } from '../config';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query';
import {
  CHAIN_ID_NUMBER,
  PendingTransaction,
  TransactionStore,
  RioTransactionType
} from '../lib/typings';

const STORE_VAR = 'transaction-store' as const;
const QUERY_KEY = [STORE_VAR] as const;

interface ContextState {
  data: TransactionStore;
  addTransaction: (tx: PendingTransaction) => void;
  removeTransaction: (tx: { hash: Hash; type?: RioTransactionType }) => void;
}

const DEFAULT_STATE: ContextState = {
  data: {},
  addTransaction: () => {},
  removeTransaction: () => {}
};

const RioTransactionStoreContext = createContext<ContextState>(DEFAULT_STATE);

export default function RioTransactionStoreProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const chainId = (useChainId() || CHAIN_ID) as CHAIN_ID_NUMBER;
  const { data } = useLocalStorageTransactions();
  const { mutate: addTransaction } = useAddTransactionMutation();
  const { mutate: removeTransaction } = useRemoveTransactionMutation();

  const nextTx = useMemo(() => data[chainId]?.[0], [data, chainId]);

  const { isError, isSuccess } = useWaitForTransaction({ hash: nextTx?.hash });

  useEffect(() => {
    if (!!nextTx?.hash && (isError || isSuccess)) {
      removeTransaction({ hash: nextTx.hash });
    }
  }, [nextTx?.hash, isError, isSuccess]);

  return (
    <RioTransactionStoreContext.Provider
      value={useMemo(
        () => ({ data, addTransaction, removeTransaction }),
        [data, addTransaction, removeTransaction]
      )}
    >
      {children}
    </RioTransactionStoreContext.Provider>
  );
}

//////////
// hooks
//////////

export function useRioTransactionStore() {
  return useContext(RioTransactionStoreContext);
}

export function usePendingTransactions(type?: RioTransactionType) {
  const chainId = useChainId() || CHAIN_ID;
  const { data } = useRioTransactionStore();
  return useMemo(() => {
    const chainTxs = data[chainId] || ([] as PendingTransaction[]);
    if (!type) return chainTxs;
    return chainTxs.filter((tx) => tx.type === type);
  }, [type, chainId, data]);
}

export function useRemoveTransaction() {
  return useRioTransactionStore().removeTransaction;
}

export function useAddTransaction() {
  return useRioTransactionStore().addTransaction;
}

/////////////////////
// Query functions
/////////////////////

function useLocalStorageTransactions() {
  const { data, ...etc } = useQuery<TransactionStore, Error>(
    QUERY_KEY,
    () => {
      try {
        return JSON.parse(
          localStorage.getItem(STORE_VAR) || '{}'
        ) as TransactionStore;
      } catch (e) {
        return DEFAULT_STATE.data;
      }
    },
    {
      staleTime: 0,
      enabled: true,
      placeholderData: DEFAULT_STATE.data
    }
  );
  return { data: data || DEFAULT_STATE.data, ...etc };
}

function useRemoveTransactionMutation() {
  const _chainId = (useChainId() || CHAIN_ID) as CHAIN_ID_NUMBER;
  const { data: txs } = useLocalStorageTransactions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY,
    mutationFn: ({
      chainId = _chainId,
      hash
    }: {
      chainId?: CHAIN_ID_NUMBER;
      type?: RioTransactionType;
      hash: Hash;
    }) => {
      return txStoreMutationFn(
        txs,
        chainId,
        (txs[chainId] || []).filter((tx) => tx.hash !== hash)
      );
    },
    onSuccess: buildTxStoreOnSuccess(queryClient)
  });
}

function useAddTransactionMutation() {
  const _chainId = (useChainId() || CHAIN_ID) as CHAIN_ID_NUMBER;
  const { data: txs } = useLocalStorageTransactions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY,
    mutationFn: ({
      chainId = _chainId,
      ...tx
    }: PendingTransaction & { chainId?: CHAIN_ID_NUMBER }) => {
      const prevTxList = txs[chainId] || [];
      const txExists = prevTxList.find((_tx) => _tx.hash === tx.hash);
      return txExists
        ? new Promise((res) => res(txs))
        : txStoreMutationFn(txs, chainId, [...prevTxList, tx]);
    },
    onSuccess: buildTxStoreOnSuccess(queryClient)
  });
}

function txStoreMutationFn(
  txStore: TransactionStore,
  chainId: CHAIN_ID_NUMBER,
  newTxList: PendingTransaction[]
) {
  return new Promise((res) => {
    const newTxStore = { ...txStore, [chainId]: newTxList };
    localStorage.setItem(STORE_VAR, JSON.stringify(newTxStore));
    return res(newTxStore);
  });
}
function buildTxStoreOnSuccess(queryClient: QueryClient) {
  return function <T>(newTxStore: T) {
    queryClient.setQueryData(QUERY_KEY, newTxStore);
  };
}
