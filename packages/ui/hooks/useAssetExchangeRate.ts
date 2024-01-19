import { useMemo } from 'react';
import {
  AssetDetails,
  AssetFinancials,
  BaseAssetDetails,
  LRTDetails,
  LRTFinancials,
  TokenSymbol,
  UnderlyingAssetDetails
} from '../lib/typings';
import { isEqualAddress } from '../lib/utilities';
import { useGetLiquidRestakingTokens } from './useGetLiquidRestakingTokens';
import { Address } from 'viem';

interface UseAssetExchangeRateReturn {
  data: {
    lrt: number;
    eth: number;
    usd: number;
  } | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => void;
  error: Error | null;
}

export const useAssetExchangeRate = ({
  asset: _asset,
  lrt: _lrt
}: {
  asset: Address | TokenSymbol | BaseAssetDetails | null | undefined;
  lrt: LRTDetails | TokenSymbol | null | undefined;
}): UseAssetExchangeRateReturn => {
  if (!_asset || !_lrt) {
    return {
      data: null,
      isLoading: true,
      isError: false,
      isFetching: false,
      refetch: () => {},
      error: null
    };
  }

  const {
    data: lrtList,
    refetch: refetchLrtList,
    isLoading: isLrtListLoading,
    isError: isLrtListError,
    error: lrtListError
  } = useGetLiquidRestakingTokens();

  const { lrt, asset, eth, assetError } = useMemo<{
    lrt: LRTFinancials | undefined;
    asset: AssetFinancials | undefined;
    eth: AssetFinancials | undefined;
    assetError: Error | null;
  }>(() => {
    let lrt: LRTFinancials | undefined = undefined;
    let asset: AssetFinancials | undefined = undefined;
    let eth: AssetFinancials | undefined = undefined;
    try {
      for (const item of lrtList || []) {
        if (asset && eth && lrt) break;
        lrt ||= findAsset(_lrt, [item]);
        asset ||= findAsset(_asset, item.underlyingAssets, accessor)?.asset;
        eth ||= findAsset('ETH', item.underlyingAssets, accessor)?.asset;
      }
      return { asset, eth, lrt, assetError: null };
    } catch (error) {
      return { asset, eth, lrt, assetError: error as Error };
    }
  }, [_asset, _lrt, lrtList]);

  const data = useMemo(
    () => ({
      lrt: Number(asset?.latestUSDPrice) / Number(lrt?.exchangeRateUSD),
      eth: Number(asset?.latestUSDPrice) / Number(eth?.latestUSDPrice),
      usd: Number(asset?.latestUSDPrice)
    }),
    [asset, lrt, eth]
  );

  return useMemo(() => {
    return {
      data: Object.values(data).some(isNaN) ? null : data,
      isLoading: isLrtListLoading,
      isError: isLrtListError,
      isFetching: isLrtListLoading,
      refetch: refetchLrtList,
      error: lrtListError || assetError
    };
  }, [data, isLrtListLoading, isLrtListError, assetError]);
};

///////////
// helpers
///////////

function accessor(a: unknown) {
  return (a as UnderlyingAssetDetails).asset;
}

function findAsset<
  T extends LRTDetails | AssetDetails | BaseAssetDetails,
  R extends LRTDetails | UnderlyingAssetDetails
>(
  searchParam: Address | TokenSymbol | T,
  list?: R[],
  itemAccessor?: (item: unknown) => AssetDetails
) {
  const identifier =
    typeof searchParam === 'string' ? searchParam : searchParam.address;
  const accessor = itemAccessor || ((a) => a as T);
  return list?.find((a) => {
    return /^0x/.test(identifier)
      ? isEqualAddress(accessor(a).address, identifier)
      : accessor(a).symbol === identifier;
  });
}