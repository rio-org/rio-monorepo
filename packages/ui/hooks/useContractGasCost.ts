import { ExtractAbiFunctionNames } from 'abitype';
import { useFeeData, useNetwork } from 'wagmi';
import { UseQueryOptions } from 'react-query';
import { useCallback, useMemo } from 'react';
import { Abi } from 'viem';
import { CHAIN_ID } from '../config';
import {
  useEstimateContractGas,
  UseEstimateContractGasParameters,
  UseEstimateContractGasResult
} from './useEstimateContractGas';

export type UseContractGasCostParameters<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
> = UseEstimateContractGasParameters<TAbi, TFunctionName>;

export type UseContractGasCostResult = {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  gas: bigint;
  estimatedTotalCost: bigint;
};

export function useContractGasCost<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
>(
  parameters: UseContractGasCostParameters<TAbi, TFunctionName>,
  queryConfig?: Omit<
    UseQueryOptions<UseEstimateContractGasResult, Error>,
    'enabled'
  >
) {
  const networkChainId = useNetwork().chain?.id || CHAIN_ID;
  const chainId = parameters.chainId ?? networkChainId;
  const { data: estimatedGas, ...estimatedGasEtc } = useEstimateContractGas(
    parameters,
    queryConfig
  );
  const { data: feeData, ...feeDataEtc } = useFeeData({
    chainId,
    enabled: parameters.enabled
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
            maxFeePerGas: (feeData.maxFeePerGas * 110n) / 100n,
            maxPriorityFeePerGas: (feeData.maxPriorityFeePerGas * 110n) / 100n,
            gas: (estimatedGas * 110n) / 100n
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
      isIdle: feeDataEtc.isIdle && estimatedGasEtc.isIdle,
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
      feeDataEtc.isIdle,
      feeDataEtc.isFetched,
      feeDataEtc.isFetching,
      feeDataEtc.isRefetching,
      feeDataEtc.isFetchedAfterMount,
      estimatedGasEtc.isSuccess,
      estimatedGasEtc.isLoading,
      estimatedGasEtc.isError,
      estimatedGasEtc.error,
      estimatedGasEtc.isIdle,
      estimatedGasEtc.isFetched,
      estimatedGasEtc.isFetching,
      estimatedGasEtc.isRefetching,
      estimatedGasEtc.isFetchedAfterMount,
      refetch
    ]
  );
}
