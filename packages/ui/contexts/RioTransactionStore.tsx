import { createContext, useContext, useEffect, useMemo } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { type Hash } from '@wagmi/core';
import { toast } from 'sonner';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import {
  PendingTransaction,
  TransactionStore,
  RioTransactionType
} from '../lib/typings';
import { useSupportedChainId } from '../hooks/useSupportedChainId';
import { TransactionToast } from '../components/Shared/TransactionToast';
import { IconLightning } from '../components/Icons/IconLightning';
import { IconParty } from '../components/Icons/IconParty';
import { IconSad } from '../components/Icons/IconSad';

const STORE_VAR = 'transaction-store' as const;
const QUERY_KEY = [STORE_VAR] as const;

interface ContextState {
  data: TransactionStore;
  addTransaction: (tx: Omit<PendingTransaction, 'chainId'>) => void;
  removeTransaction: (tx: {
    hash: Hash;
    chainId: number;
    type?: RioTransactionType;
    toasts?: PendingTransaction['toasts'];
  }) => void;
}

const DEFAULT_STATE: ContextState = {
  data: { current: {}, past: {} },
  addTransaction: () => {},
  removeTransaction: () => {}
};

const RioTransactionStoreContext = createContext<ContextState>(DEFAULT_STATE);

export default function RioTransactionStoreProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const chainId = useSupportedChainId();
  const { data } = useLocalStorageTransactions();
  const { mutate: addTransaction } = useAddTransactionMutation();
  const { mutate: removeTransaction } = useRemoveTransactionMutation();
  const nextTx = useMemo(() => data.current[chainId]?.[0], [data, chainId]);

  const { isError, isSuccess } = useWaitForTransactionReceipt({
    hash: nextTx?.hash
  });

  useEffect(() => {
    if (!nextTx?.hash) return;

    if (!isError && !isSuccess) {
      return void toast(
        <TransactionToast
          hash={nextTx.hash}
          icon={<IconLightning />}
          title={nextTx.toasts?.sent || 'Transaction Sent'}
          chainId={nextTx.chainId}
        />
      );
    }

    toast(
      <TransactionToast
        hash={nextTx.hash}
        chainId={nextTx.chainId}
        icon={isError ? <IconSad /> : <IconParty />}
        title={
          isError
            ? nextTx.toasts?.error || 'Transaction Reverted'
            : nextTx.toasts?.success || 'Transaction Confirmed'
        }
      />
    );
    removeTransaction({ hash: nextTx.hash, chainId: nextTx.chainId });
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
  const chainId = useSupportedChainId();
  const { data } = useRioTransactionStore();
  return useMemo(() => {
    const chainTxs = data.current[chainId] || ([] as PendingTransaction[]);
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
  const { data, ...etc } = useQuery<TransactionStore, Error>({
    queryKey: QUERY_KEY,
    queryFn: () => {
      try {
        return {
          current: {},
          past: {},
          ...JSON.parse(localStorage.getItem(STORE_VAR) || '{}')
        } as TransactionStore;
      } catch (e) {
        return DEFAULT_STATE.data;
      }
    },
    staleTime: 0,
    enabled: true,
    placeholderData: DEFAULT_STATE.data
  });
  return { data: data || DEFAULT_STATE.data, ...etc };
}

function useRemoveTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY,
    mutationFn: async ({
      chainId,
      hash
    }: {
      hash: Hash;
      chainId: number;
      type?: RioTransactionType;
    }) => {
      const txs =
        queryClient.getQueryData<TransactionStore>(QUERY_KEY) ??
        DEFAULT_STATE.data;
      const withoutTx = (txs.current[chainId] || []).filter(
        (tx) => tx.hash !== hash
      );
      const newTxStore = txStoreMutationFn(
        txs,
        queryClient,
        chainId,
        withoutTx
      );
      return Promise.resolve(newTxStore);
    }
  });
}

function useAddTransactionMutation() {
  const queryClient = useQueryClient();
  const chainId = useSupportedChainId();

  return useMutation({
    mutationKey: QUERY_KEY,
    mutationFn: async (tx: Omit<PendingTransaction, 'chainId'>) => {
      const txs =
        queryClient.getQueryData<TransactionStore>(QUERY_KEY) ??
        DEFAULT_STATE.data;
      const txList = txs.current[chainId] || [];
      const txExists = txList.find((_tx) => _tx.hash === tx.hash);
      const txAlreadyFinished = txs.past[tx.hash];

      return txExists || txAlreadyFinished
        ? Promise.resolve(txs)
        : txStoreMutationFn(txs, queryClient, chainId, [
            ...txList,
            { ...tx, chainId }
          ]);
    }
  });
}

function txStoreMutationFn(
  txStore: TransactionStore,
  queryClient: QueryClient,
  chainId: number,
  newTxList: PendingTransaction[]
) {
  return new Promise((resolve) => {
    const lastHash = newTxList[newTxList.length - 1]?.hash;
    const past = { ...txStore.past, ...(lastHash && { [lastHash]: true }) };
    const current = { ...txStore.current, [chainId]: newTxList };
    const newTxStore = { past, current };
    localStorage.setItem(STORE_VAR, JSON.stringify(newTxStore));
    queryClient.setQueryData(QUERY_KEY, newTxStore);
    return resolve(newTxStore);
  });
}
