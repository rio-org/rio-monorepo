import { useNetwork, useSwitchNetwork, useWaitForTransaction } from 'wagmi';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  clearErrors?: () => void;
  refetch?: () => void;
  write?: () => void;
};

export const useTransactionButton = ({
  transactionType: type,
  disabled,
  hash,
  error,
  clearErrors,
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
  const [internalError, setInternalError] = useState<ContractError | null>(
    error || null
  );

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

  useEffect(() => {
    if (!error && !txError) return;
    setInternalError(error ?? txError);
  }, [error, txError]);

  const [, errorMessage] = useMemo(() => {
    const e = internalError;
    return [e, e?.shortMessage ?? e?.message];
  }, [internalError]);

  const isDisabled = wrongNetwork
    ? isSwitchNetworkLoading
    : isTxLoading || isSigning || disabled || !write || !!prevTx?.hash;

  const handleClearErrors = useCallback(() => {
    clearErrors?.();
    setInternalError(null);
  }, [clearErrors]);

  const handleClick = useCallback((): void => {
    if (isDisabled) return;
    if (!address) return openWalletModal();
    handleClearErrors();
    wrongNetwork ? switchNetwork?.(CHAIN_ID) : write?.();
  }, [
    isDisabled,
    address,
    wrongNetwork,
    handleClearErrors,
    switchNetwork,
    write
  ]);

  return {
    errorMessage,
    isTxLoading,
    isTxError,
    isTxSuccess,
    isDisabled,
    handleClearErrors,
    handleClick,
    prevTx
  };
};
