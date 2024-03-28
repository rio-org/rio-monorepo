import { type UseQueryOptions } from '@tanstack/react-query';
import { type Abi, type ContractFunctionName } from 'viem';
import { useEstimateFeesPerGas } from 'wagmi';
import { useCallback, useMemo } from 'react';
import { useSupportedChainId } from './useSupportedChainId';
import {
  useEstimateContractGas,
  UseEstimateContractGasParameters,
  UseEstimateContractGasResult
} from './useEstimateContractGas';

export type UseContractGasCostParameters<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi>
> = UseEstimateContractGasParameters<TAbi, TFunctionName>;

export type UseContractGasCostResult = {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  gas: bigint;
  estimatedTotalCost: bigint;
};

export function useContractGasCost<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi>
>(
  parameters: UseContractGasCostParameters<TAbi, TFunctionName>,
  queryConfig?: Omit<
    UseQueryOptions<UseEstimateContractGasResult, Error>,
    'enabled' | 'queryKey' | 'queryFn'
  >
) {
  const networkChainId = useSupportedChainId();
  const chainId = parameters.chainId ?? networkChainId;
  const { data: estimatedGas, ...estimatedGasEtc } = useEstimateContractGas(
    parameters,
    queryConfig
  );
  const { data: feeData, ...feeDataEtc } = useEstimateFeesPerGas({
    chainId
  });

  const refetch = useCallback(async () => {
    await feeDataEtc.refetch();
    await estimatedGasEtc.refetch();
  }, [feeDataEtc.refetch, estimatedGasEtc.refetch]);

  const data = useMemo(
    () =>
      !feeData?.maxFeePerGas ||
      !feeData?.maxPriorityFeePerGas ||
      typeof estimatedGas === 'undefined'
        ? undefined
        : {
            maxFeePerGas: (BigInt(feeData.maxFeePerGas) * 110n) / 100n,
            maxPriorityFeePerGas:
              (BigInt(feeData.maxPriorityFeePerGas) * 110n) / 100n,
            gas: (BigInt(estimatedGas) * 110n) / 100n + 20_000n
          },
    [feeData?.maxFeePerGas, feeData?.maxPriorityFeePerGas, estimatedGas]
  );

  return useMemo(
    () => ({
      data: !data
        ? undefined
        : {
            ...data,
            estimatedTotalCost: data.gas * data.maxFeePerGas
          },
      isSuccess: feeDataEtc.isSuccess && estimatedGasEtc.isSuccess,
      isLoading: feeDataEtc.isLoading || estimatedGasEtc.isLoading,
      isError: feeDataEtc.isError || estimatedGasEtc.isError,
      error: feeDataEtc.error || estimatedGasEtc.error,
      isFetched: feeDataEtc.isFetched && estimatedGasEtc.isFetched,
      isFetching: feeDataEtc.isFetching || estimatedGasEtc.isFetching,
      isRefetching: feeDataEtc.isRefetching || estimatedGasEtc.isRefetching,
      isFetchedAfterMount:
        feeDataEtc.isFetchedAfterMount && estimatedGasEtc.isFetchedAfterMount,
      refetch
    }),
    [
      feeData?.maxFeePerGas,
      feeData?.maxPriorityFeePerGas,
      estimatedGas,
      feeDataEtc.isSuccess,
      feeDataEtc.isLoading,
      feeDataEtc.isError,
      feeDataEtc.error,
      feeDataEtc.isFetched,
      feeDataEtc.isFetching,
      feeDataEtc.isRefetching,
      feeDataEtc.isFetchedAfterMount,
      estimatedGasEtc.isSuccess,
      estimatedGasEtc.isLoading,
      estimatedGasEtc.isError,
      estimatedGasEtc.error,
      estimatedGasEtc.isFetched,
      estimatedGasEtc.isFetching,
      estimatedGasEtc.isRefetching,
      estimatedGasEtc.isFetchedAfterMount,
      refetch
    ]
  );
}
