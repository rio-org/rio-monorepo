import { PublicClient, useNetwork, usePublicClient } from 'wagmi';
import { useAccountIfMounted } from './useAccountIfMounted';
import { CHAIN_ID } from '../config';
import { Abi, Account, Address, EstimateContractGasParameters } from 'viem';
import { UseQueryOptions, useQuery } from 'react-query';
import { asType } from '../lib/utilities';
import { ExtractAbiFunctionNames } from 'abitype';

/////////////////
// Module Types
/////////////////

export type UseEstimateContractGasResult = bigint;

export type UseEstimateContractGasParameters<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
> = Pick<
  EstimateContractGasParameters<TAbi, TFunctionName>,
  'address' | 'args' | 'value'
> & {
  chainId?: number;
  account?: Account | Address;
  abi: TAbi;
  functionName: TFunctionName;
  enabled?: UseQueryOptions<UseEstimateContractGasResult, Error>['enabled'];
};

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
    chainId: _chainId,
    enabled
  }: UseEstimateContractGasParameters<TAbi, TFunctionName>,
  queryConfig?: Omit<
    UseQueryOptions<UseEstimateContractGasResult, Error>,
    'enabled'
  >
) {
  const { address: accountAddress } = useAccountIfMounted();
  const networkChainId = useNetwork().chain?.id || CHAIN_ID;
  const chainId = _chainId ?? networkChainId;
  const client = usePublicClient({ chainId });
  const account = configAddress ?? accountAddress;
  return useQuery<UseEstimateContractGasResult, Error>(
    [
      'useEstimateContractGas',
      chainId,
      account,
      address,
      functionName,
      value?.toString() ?? jsonifyDeep(args)
    ] as const,
    buildFetcher({
      client,
      config: { account, abi, address, functionName, args, value }
    }),
    {
      staleTime: 12 * 1000,
      ...queryConfig,
      enabled: !!account && !!address && enabled !== false
    }
  );
}

////////////
// Fetcher
////////////

function buildFetcher<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>
>(opts: {
  client?: PublicClient;
  config: Omit<
    UseEstimateContractGasParameters<TAbi, TFunctionName>,
    'enabled'
  >;
}) {
  return async (): Promise<UseEstimateContractGasResult> => {
    const { client, config: _config } = opts;
    const { account, ...config } = _config;

    if (!client || !account) {
      return 0n;
    }

    try {
      return client.estimateContractGas(
        asType<EstimateContractGasParameters<TAbi, TFunctionName>>({
          account,
          ...config
        })
      );
    } catch (e) {
      console.error(e);
      return 0n;
    }
  };
}

////////////
// Helpers
////////////

function jsonifyDeep<T>(args: T): string {
  return !args
    ? 'undefined'
    : Array.isArray(args)
    ? JSON.stringify(args?.map((arg) => (!arg ? '' : `${arg}`)))
    : typeof args !== 'object'
    ? JSON.stringify(args || '')
    : JSON.stringify(
        Object.fromEntries(
          Object.entries(args).map(([k, v]) => [
            k,
            !v ? '' : jsonifyDeep(v as unknown)
          ])
        )
      );
}
