import { UseQueryOptions, useQuery } from 'react-query';
import {
  ClaimWithdrawalParams,
  SubgraphClient,
  WithdrawalRequest,
  useSubgraph
} from '@rionetwork/sdk-react';
import { BaseAssetDetails, TokenSymbol } from '../lib/typings';
import { useGetAssetsList } from './useGetAssetsList';
import { getAddress } from 'viem';
import { useCallback } from 'react';

// export const useGetAccountWithdrawals = (
//   config?: Parameters<SubgraphClient['getWithdrawalRequests']>[0] & {
//     enabled?: boolean;
//   }
// ) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isError, setIsError] = useState<Error>();
//   const [data, setData] = useState<WithdrawalRequest[]>();

//   const subgraph = useSubgraph();

//   const fetch = useCallback(() => {
//     console.log(JSON.stringify(config || {}));
//     if (config?.enabled === false) return;
//     setIsLoading(true);
//     subgraph
//       .getWithdrawalRequests(config)
//       .then(setData)
//       .catch((e: Error) => (console.error(e), setIsError(e)))
//       .finally(() => setIsLoading(false));
//   }, [JSON.stringify(config || {})]);

//   useEffect(fetch, [fetch]);

//   return {
//     data,
//     isLoading,
//     isError,
//     refetch: fetch
//   };
// };

interface UseGetAccountWithdrawalsReturn {
  withdrawalRequests: WithdrawalRequest[];
  withdrawalParams: ClaimWithdrawalParams[];
  withdrawalAssets: { amount: number; symbol: TokenSymbol }[];
}

function getFetcher(subgraph: SubgraphClient, assets?: BaseAssetDetails[]) {
  return (config?: Parameters<SubgraphClient['getWithdrawalRequests']>[0]) =>
    subgraph
      .getWithdrawalRequests(config)
      .then((withdrawalRequests) => {
        const withdrawalParams: ClaimWithdrawalParams[] = [];
        const withdrawalAssets: { amount: number; symbol: TokenSymbol }[] = [
          { amount: 0, symbol: 'ETH' }
        ];
        withdrawalRequests
          ?.filter((r) => r.isReadyToClaim && !r.isClaimed)
          .forEach((r) => {
            const asset = assets?.find(
              (a) => getAddress(a.address) === getAddress(r.assetOut)
            );
            if (!asset) return;
            withdrawalParams.push({ assetOut: r.assetOut, epoch: r.epoch });
            withdrawalAssets.push({
              amount: parseFloat(r.amountClaimed ?? '0'),
              symbol: asset.symbol
            });
          });
        return {
          withdrawalRequests,
          withdrawalParams,
          withdrawalAssets
        } as UseGetAccountWithdrawalsReturn;
      })
      .catch((e: Error) => {
        console.error(e);
        throw e;
      });
}

const buildQueryKey = (
  config?: Parameters<SubgraphClient['getWithdrawalRequests']>[0]
) =>
  [
    'getWithdrawalRequests',
    config?.orderBy,
    config?.orderDirection,
    config?.page,
    config?.perPage,
    config?.where?.sender,
    config?.where?.restakingToken
  ] as const;

export function useGetAccountWithdrawals(
  config?: Parameters<SubgraphClient['getWithdrawalRequests']>[0],
  queryConfig?: UseQueryOptions<UseGetAccountWithdrawalsReturn, Error>
) {
  const subgraph = useSubgraph();
  const { data: assets } = useGetAssetsList();
  const fetcher = useCallback(
    () => getFetcher(subgraph, assets)(config),
    [assets, config]
  );
  return useQuery<UseGetAccountWithdrawalsReturn, Error>(
    buildQueryKey(config),
    fetcher,
    {
      staleTime: 30 * 1000,
      placeholderData: {
        withdrawalRequests: [],
        withdrawalParams: [],
        withdrawalAssets: [{ amount: 0, symbol: 'ETH' }]
      },
      ...queryConfig,
      enabled: !!assets?.length && queryConfig?.enabled !== false
    }
  );
}
