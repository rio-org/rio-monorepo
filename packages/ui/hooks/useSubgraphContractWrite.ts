import { useCallback, useEffect, useMemo, useState } from 'react';
import { Hash } from 'viem';
import { useWaitForTransaction } from 'wagmi';
import { ContractError } from '../lib/typings';

interface TxState {
  txHash: Hash | undefined;
  isLoading: boolean;
  error: ContractError | null;
  success: boolean;
}

const DEFAULT_STATE: TxState = {
  txHash: undefined,
  isLoading: false,
  error: null,
  success: false
};

export const useSubgraphConstractWrite = <T extends Hash = Hash, R = unknown>({
  execute,
  onReset,
  enabled,
  confirmations
}: {
  execute(): Promise<T | undefined>;
  onReset?: () => Promise<R>;
  enabled?: boolean;
  confirmations?: number;
}) => {
  const [{ txHash, isLoading, error, success }, setTxState] =
    useState<TxState>(DEFAULT_STATE);

  const write = useCallback(async () => {
    if (!enabled || isLoading) {
      return;
    }
    setTxState((prev) => ({ ...prev, isLoading: true }));
    return await execute()
      .then((txHash) => setTxState((prev) => ({ ...prev, txHash })))
      .catch((error) => setTxState((prev) => ({ ...prev, error })));
  }, [execute, enabled, confirmations]);

  const {
    data: txData,
    error: txError,
    isLoading: isTxLoading,
    isSuccess: isTxSuccess
  } = useWaitForTransaction({ hash: txHash, confirmations });

  const reset = useCallback(() => {
    onReset?.().catch(console.error);
    setTxState(DEFAULT_STATE);
  }, [onReset]);

  useEffect(() => {
    setTxState((prev) => ({
      ...prev,
      isLoading:
        error || txError || isTxSuccess ? false : isLoading || isTxLoading,
      error: txError || error,
      success: isTxSuccess
    }));
  }, [reset, txData, error, txError, isLoading, isTxLoading, isTxSuccess]);

  return useMemo(
    () => ({
      write: !enabled || isLoading ? undefined : write,
      txHash,
      isLoading,
      error,
      success,
      reset
    }),
    [txHash, isLoading, error, enabled, success, reset]
  );
};
