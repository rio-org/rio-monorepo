import {
  UsePrepareContractWriteConfig,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';
import { WalletClient } from '@wagmi/core';
import { Abi } from 'viem';
import { ContractError } from '../lib/typings';

export function useCompleteContractWrite<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TChainId extends number,
  TWalletClient extends WalletClient
>(
  preparedContractWriteConfig: UsePrepareContractWriteConfig<
    TAbi,
    TFunctionName,
    TChainId,
    TWalletClient
  >,
  waitForTransactionConfig?: { confirmations: number }
) {
  const prepareContractWrite = usePrepareContractWrite<
    TAbi,
    TFunctionName,
    TChainId
  >(preparedContractWriteConfig);

  const contractWrite = useContractWrite<TAbi, TFunctionName, 'prepared'>(
    prepareContractWrite.config
  );

  const waitForTx = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    confirmations: waitForTransactionConfig?.confirmations
  });

  const isUserSigning =
    prepareContractWrite.isLoading || contractWrite.isLoading;
  const txError =
    prepareContractWrite.error || contractWrite.error || waitForTx.error;
  const isTxPending =
    !!contractWrite.data?.hash && !waitForTx.isSuccess && !waitForTx.error;
  const isTxComplete =
    !!contractWrite.data?.hash && (waitForTx.isSuccess || !!waitForTx.error);

  return {
    status: {
      isUserSigning,
      isTxPending,
      isTxComplete,
      txError
    },
    prepareContractWrite,
    contractWrite,
    waitForTx
  } as {
    status: {
      isUserSigning: boolean;
      isTxPending: boolean;
      isTxComplete: boolean;
      txError: ContractError | undefined;
    };
    prepareContractWrite: ReturnType<
      typeof usePrepareContractWrite<TAbi, TFunctionName, TChainId>
    >;
    contractWrite: ReturnType<
      typeof useContractWrite<TAbi, TFunctionName, 'prepared'>
    >;
    waitForTx: ReturnType<typeof useWaitForTransaction>;
  };
}
