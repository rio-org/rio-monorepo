import {
  useWriteContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  type Config,
  type UseWriteContractReturnType,
  type UseSimulateContractParameters
} from 'wagmi';
import {
  type Abi,
  type AbiStateMutability,
  type ContractFunctionArgs,
  type ContractFunctionName
} from 'viem';
import { ContractError } from '../lib/typings';

export function useCompleteContractWrite<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends ContractFunctionName<TAbi>,
  TArgs extends ContractFunctionArgs<TAbi, AbiStateMutability, TFunctionName>,
  TChainId extends number
>(
  preparedContractWriteConfig: UseSimulateContractParameters<
    TAbi,
    TFunctionName,
    TArgs,
    Config,
    TChainId
  >,
  waitForTransactionConfig?: { confirmations: number }
) {
  const prepareContractWrite = useSimulateContract<
    TAbi,
    TFunctionName,
    TArgs,
    Config,
    TChainId
  >(preparedContractWriteConfig);

  const contractWrite = useWriteContract();

  const waitForTx = useWaitForTransactionReceipt({
    hash: contractWrite.data,
    confirmations: waitForTransactionConfig?.confirmations
  });

  const isUserSigning =
    prepareContractWrite.isLoading || contractWrite.isPending;
  const txError =
    prepareContractWrite.error || contractWrite.error || waitForTx.error;
  const isTxPending =
    !!contractWrite.data && !waitForTx.isSuccess && !waitForTx.error;
  const isTxComplete =
    !!contractWrite.data && (waitForTx.isSuccess || !!waitForTx.error);

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
      typeof useSimulateContract<TAbi, TFunctionName, TArgs, Config, TChainId>
    >;
    contractWrite: UseWriteContractReturnType;
    waitForTx: ReturnType<typeof useWaitForTransactionReceipt>;
  };
}
