import { useNetwork, useSwitchNetwork, useWaitForTransaction } from 'wagmi';
import { useCallback, useEffect, useMemo } from 'react';
import { type Hash } from 'viem';
import { useWalletAndTermsStore } from '../contexts/WalletAndTermsStore';
import {
  useAddTransaction,
  usePendingTransactions
} from '../contexts/RioTransactionStore';
import { useAccountIfMounted } from './useAccountIfMounted';
import { CHAIN_ID } from 'config';
import { type ContractError, type RioTransactionType } from '../lib/typings';

export type UseTransactionButtonConfig = {
  transactionType: RioTransactionType;
  disabled?: boolean;
  isSigning?: boolean;
  hash?: Hash;
  error?: ContractError | null;
  refetch?: () => void;
  write?: () => void;
};

export const useTransactionButton = ({
  transactionType: type,
  disabled,
  hash,
  error,
  refetch,
  write,
  isSigning
}: UseTransactionButtonConfig) => {
  const wrongNetwork = useNetwork().chain?.unsupported;
  const { openWalletModal } = useWalletAndTermsStore();
  const { address } = useAccountIfMounted();
  const pendingTxs = usePendingTransactions();
  const addTransaction = useAddTransaction();
  const { isLoading: isSwitchNetworkLoading, switchNetwork } =
    useSwitchNetwork();

  const lastPendingTx = !pendingTxs.length
    ? null
    : pendingTxs[pendingTxs.length - 1];

  const prevTx = useMemo(() => {
    if (!lastPendingTx) return null;
    return {
      hash: lastPendingTx.hash,
      isSame: lastPendingTx.type === type
    };
  }, [lastPendingTx]);

  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    isError: isTxError,
    error: txError
  } = useWaitForTransaction({
    hash: prevTx?.isSame ? prevTx.hash : hash
  });

  const { isSuccess: isPrevTxSuccess } = useWaitForTransaction({
    hash: prevTx?.isSame ? undefined : prevTx?.hash
  });

  const shouldRefetchData = isTxSuccess || isPrevTxSuccess;
  useEffect(() => void (shouldRefetchData && refetch?.()), [shouldRefetchData]);

  useEffect(() => {
    if (!hash) return;
    addTransaction({ hash, type });
  }, [hash, type]);

  const [, errorMessage] = useMemo(() => {
    const e = (txError ?? error) as ContractError | null;
    return [e, e?.shortMessage ?? e?.message];
  }, [txError, error]);

  const isDisabled = wrongNetwork
    ? isSwitchNetworkLoading
    : isTxLoading || isSigning || disabled || !write || !!prevTx?.hash;

  const handleClick = useCallback((): void => {
    if (isDisabled) return;
    if (!address) return openWalletModal();
    wrongNetwork ? switchNetwork?.(CHAIN_ID) : write?.();
  }, [isDisabled, address, wrongNetwork, switchNetwork, write]);

  return {
    errorMessage,
    isTxLoading,
    isTxError,
    isTxSuccess,
    isDisabled,
    handleClick,
    prevTx
  };
};
