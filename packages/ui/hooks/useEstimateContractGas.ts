import { usePublicClient } from 'wagmi';
import {
  type PublicClient,
  type Abi,
  type Account,
  type Address,
  type EstimateContractGasParameters,
  type ContractFunctionName
} from 'viem';
import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery
} from '@tanstack/react-query';
import { useAccountIfMounted } from './useAccountIfMounted';
import { asType } from '../lib/utilities';
import { CHAIN_ID } from '../config';

/////////////////
// Module Types
/////////////////

export type UseEstimateContractGasResult = bigint;

export type UseEstimateContractGasParameters<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'payable' | 'nonpayable'>
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
  TFunctionName extends ContractFunctionName<TAbi>
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
    'enabled' | 'queryKey' | 'queryFn'
  >
): UseQueryResult<UseEstimateContractGasResult, Error> {
  const { address: accountAddress, chain } = useAccountIfMounted();
  const networkChainId = chain?.id || CHAIN_ID;
  const chainId = _chainId ?? networkChainId;
  const client = usePublicClient({ chainId });
  const account = configAddress ?? accountAddress;
  return useQuery<UseEstimateContractGasResult, Error>({
    queryKey: [
      'useEstimateContractGas',
      chainId,
      account,
      address,
      functionName,
      value?.toString() ?? jsonifyDeep(args)
    ] as const,
    queryFn: buildFetcher({
      client,
      config: { account, abi, address, functionName, args, value }
    }),
    staleTime: 12 * 1000,
    ...queryConfig,
    enabled: !!account && !!address && enabled !== false
  });
}

////////////
// Fetcher
////////////

function buildFetcher<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'payable' | 'nonpayable'>
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
