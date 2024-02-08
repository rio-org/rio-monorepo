import { PublicClient, useNetwork, usePublicClient } from 'wagmi';
import { useAccountIfMounted } from './useAccountIfMounted';
import { CHAIN_ID } from '../config';
import {
  Abi,
  Account,
  Address,
  EstimateContractGasParameters,
  InferFunctionName
} from 'viem';
import { UseQueryOptions, useQuery } from 'react-query';
import { asType } from '../lib/utilities';
import { ExtractAbiFunctionNames } from 'abitype';

/////////////////
// Module Types
/////////////////

type LocalEstimateGasParamters<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
> = EstimateContractGasParameters<TAbi, TFunctionName>;

export type UseGasEstimatesResult = {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  contractGas: bigint;
  estimatedTotalCost: bigint;
};

type BasicEstimateContractGasParameters<
  TAbi extends Abi,
  TFunctionName extends string = InferFunctionName<
    TAbi,
    string,
    'payable' | 'nonpayable'
  >
> = {
  account?: Account | Address;
  abi: TAbi;
  address: LocalEstimateGasParamters<TAbi, TFunctionName>['address'];
  functionName: TFunctionName;
  args?: LocalEstimateGasParamters<TAbi, TFunctionName>['args'];
  value?: LocalEstimateGasParamters<TAbi, TFunctionName>['value'];
};

export type UseGasEstimatesParameters<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
> = BasicEstimateContractGasParameters<TAbi, TFunctionName> & {
  enabled?: UseQueryOptions<UseGasEstimatesResult, Error>['enabled'];
};

//////////////////////
// Fetcher + Helpers
//////////////////////

type BuildFetcherParameters<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
> = {
  client?: PublicClient;
  config: BasicEstimateContractGasParameters<TAbi, TFunctionName>;
};

const defaultResult: UseGasEstimatesResult = {
  maxPriorityFeePerGas: 0n,
  maxFeePerGas: 0n,
  contractGas: 0n,
  estimatedTotalCost: 0n
};

const buildFetcher = <
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
>(
  opts: BuildFetcherParameters<TAbi, TFunctionName>
) => {
  return async (): Promise<UseGasEstimatesResult> => {
    const { client, config: _config } = opts;
    const { account, ...config } = _config;

    if (!client || !account) {
      return defaultResult;
    }

    try {
      const [{ maxFeePerGas = 0n, maxPriorityFeePerGas = 0n }, contractGas] =
        await Promise.all([
          client.estimateFeesPerGas(),
          client.estimateContractGas(
            asType<EstimateContractGasParameters<TAbi, TFunctionName>>({
              account,
              ...config
            })
          )
        ]);

      const estimatedTotalCost =
        (contractGas * (maxFeePerGas + maxPriorityFeePerGas) * 120n) / 100n;
      return {
        maxFeePerGas,
        maxPriorityFeePerGas,
        estimatedTotalCost,
        contractGas
      };
    } catch (e) {
      console.error(e);
      return defaultResult;
    }
  };
};

const Jsonify = (args: unknown): string =>
  !args
    ? 'undefined'
    : Array.isArray(args)
    ? JSON.stringify(args?.map((arg) => (!arg ? '' : `${arg}`)))
    : typeof args !== 'object'
    ? JSON.stringify(args || '')
    : JSON.stringify(
        Object.fromEntries(
          Object.entries(args).map(([k, v]) => [
            k,
            !v ? '' : Jsonify(v as unknown)
          ])
        )
      );

const JsonifyArgs = <
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
>(
  args?: EstimateContractGasParameters<TAbi, TFunctionName>['args']
) => Jsonify(args);

//////////
// Query
//////////

export function useEstimateContractGas<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
>(
  {
    account: configAddress,
    abi,
    address,
    functionName,
    args,
    value,
    enabled
  }: UseGasEstimatesParameters<TAbi, TFunctionName>,
  queryConfig?: Omit<UseQueryOptions<UseGasEstimatesResult, Error>, 'enabled'>
) {
  const { address: accountAddress } = useAccountIfMounted();
  const client = usePublicClient();
  const chainId = useNetwork().chain?.id || CHAIN_ID;
  const account = configAddress ?? accountAddress;
  return useQuery<UseGasEstimatesResult, Error>(
    [
      'useGasEstimates',
      chainId,
      account,
      address,
      functionName,
      value?.toString() ?? '0',
      JsonifyArgs<TAbi, TFunctionName>(args)
    ] as const,
    buildFetcher({
      client,
      config: { account, abi, address, functionName, args, value }
    }),
    {
      staleTime: 12 * 1000,
      ...queryConfig,
      enabled: !!account && enabled !== false
    }
  );
}
