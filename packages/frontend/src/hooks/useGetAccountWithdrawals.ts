import { UseQueryOptions, useQuery } from 'react-query';
import {
  ClaimWithdrawalParams,
  SubgraphClient,
  WithdrawalRequest,
  useSubgraph
} from '@rionetwork/sdk-react';
import { BaseAssetDetails, EthereumAddress, TokenSymbol } from '../lib/typings';
import { buildRioSdkRestakingKey, isEqualAddress } from '../lib/utilities';
import { useGetAssetsList } from './useGetAssetsList';

interface UseGetAccountWithdrawalsReturn {
  withdrawalRequests?: WithdrawalRequest[];
  withdrawalParams: ClaimWithdrawalParams[];
  withdrawalAssets: { amount: number; symbol: TokenSymbol }[];
}

function buildFetcherAndParser(
  subgraph: SubgraphClient,
  assets?: BaseAssetDetails[],
  config?: Parameters<SubgraphClient['getWithdrawalRequests']>[0]
) {
  return async () => {
    const withdrawalRequests = await subgraph.getWithdrawalRequests(config);
    // store a dictionary of assets to claim per epoch number
    const byEpoch: Record<string, Record<EthereumAddress, true>> = {};
    // store a dictionary of the amount to claim per asset symbol
    const byAsset: Partial<Record<TokenSymbol, number>> = { ETH: 0 };

    // Loop through each withdrawal request
    withdrawalRequests?.forEach((r) => {
      // Filter our requests that are not ready to claim or have already been claimed
      if (!r.isReadyToClaim || r.isClaimed) return;
      // Store each asset that is ready to claim in the epoch dictionary
      byEpoch[r.epoch] = { ...byEpoch[r.epoch], [r.assetOut]: true };
      // Find the symbol for the asset
      const a = assets?.find((a) => isEqualAddress(a.address, r.assetOut));
      // If we don't have the asset in our list (UI only, won't affect claim), skip it
      if (!a) return;
      // Add the amount to the asset
      byAsset[a.symbol] =
        (byAsset[a.symbol] || 0) + parseFloat(r.amountOut ?? '0');
    });

    // Return the withdrawal requests, the withdrawal params, and the withdrawal assets
    return <UseGetAccountWithdrawalsReturn>{
      withdrawalRequests,
      // Flatten the epoch dictionary into an array of withdrawal params
      withdrawalParams: Object.entries(byEpoch)
        .map(([epoch, assetLookup]) =>
          Object.keys(assetLookup).map((assetOut) => ({ epoch, assetOut }))
        )
        .flat(),
      // Flatten the asset dictionary into an array of withdrawal assets
      withdrawalAssets: Object.entries(byAsset).map(([symbol, amount]) => ({
        symbol,
        amount
      }))
    };
  };
}

export function useGetAccountWithdrawals(
  config?: Parameters<SubgraphClient['getWithdrawalRequests']>[0],
  queryConfig?: UseQueryOptions<UseGetAccountWithdrawalsReturn, Error>
) {
  const subgraph = useSubgraph();
  const { data: assets } = useGetAssetsList();
  return useQuery<UseGetAccountWithdrawalsReturn, Error>(
    buildRioSdkRestakingKey('getWithdrawalRequests', config),
    buildFetcherAndParser(subgraph, assets, config),
    {
      staleTime: 30 * 1000,
      placeholderData: {
        withdrawalParams: [],
        withdrawalAssets: [{ amount: 0, symbol: 'ETH' }]
      },
      ...queryConfig,
      enabled: !!assets?.length && queryConfig?.enabled !== false
    }
  );
}
