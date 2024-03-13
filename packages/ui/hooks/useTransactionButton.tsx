import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';
import { type Hash } from 'viem';
import { toast } from 'sonner';
import { useWalletAndTermsStore } from '../contexts/WalletAndTermsStore';
import { useAccountIfMounted } from './useAccountIfMounted';
import {
  useAddTransaction,
  usePendingTransactions
} from '../contexts/RioTransactionStore';
import { TransactionToast } from '../components/Shared/TransactionToast';
import { IconSad } from '../components/Icons/IconSad';
import { CHAIN_ID } from 'config';
import {
  PendingTransaction,
  type ContractError,
  type RioTransactionType
} from '../lib/typings';
import { useRegionChecked } from './useRegionChecked';
import { mainnet } from 'viem/chains';

export type UseTransactionButtonConfig = {
  transactionType: RioTransactionType;
  toasts: PendingTransaction['toasts'];
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
  toasts,
  disabled,
  hash,
  error,
  clearErrors,
  refetch,
  write,
  isSigning
}: UseTransactionButtonConfig) => {
  const { address, chain } = useAccountIfMounted();
  const {
    chains,
    switchChain,
    isPending: isSwitchNetworkLoading
  } = useSwitchChain();
  const [{ data: isInAllowedRegion }] = useRegionChecked();
  const wrongNetwork = !!address && !chains.find((c) => c.id === chain?.id);
  const { openWalletModal } = useWalletAndTermsStore();
  const pendingTxs = usePendingTransactions();
  const addTransaction = useAddTransaction();
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
  } = useWaitForTransactionReceipt({
    hash: prevTx?.isSame ? prevTx.hash : hash
  });

  const { isSuccess: isPrevTxSuccess } = useWaitForTransactionReceipt({
    hash: prevTx?.isSame ? undefined : prevTx?.hash
  });

  const shouldRefetchData = isTxSuccess || isPrevTxSuccess;
  useEffect(() => void (shouldRefetchData && refetch?.()), [shouldRefetchData]);

  useEffect(() => {
    if (!hash) return;
    addTransaction({
      hash,
      type,
      toasts: {
        sent: toasts.sent,
        success: toasts.success,
        error: toasts.error
      }
    });
  }, [hash, type, toasts.sent, toasts.success, toasts.error]);

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
    : isTxLoading ||
      isSigning ||
      disabled ||
      !write ||
      !!prevTx?.hash ||
      (chain?.id === mainnet.id && isInAllowedRegion === false);

  const handleClearErrors = useCallback(() => {
    clearErrors?.();
    setInternalError(null);
  }, [clearErrors]);

  const handleClick = useCallback((): void => {
    if (isInAllowedRegion === false) return;
    if (isDisabled) return;
    if (!address) return openWalletModal();
    handleClearErrors();
    wrongNetwork ? switchChain?.({ chainId: CHAIN_ID }) : write?.();
  }, [
    isInAllowedRegion,
    isDisabled,
    address,
    wrongNetwork,
    handleClearErrors,
    switchChain,
    write
  ]);

  useEffect(
    function emitTxErrorToast() {
      if (!errorMessage || hash) return;
      toast(
        <TransactionToast
          icon={<IconSad />}
          title={errorMessage}
          hash={hash}
          chainId={chain?.id}
        />
      );
    },
    [hash, errorMessage, !!refetch]
  );

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
