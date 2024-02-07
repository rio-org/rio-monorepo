import { useBalance } from 'wagmi';
import { AssetDetails, LRTDetails } from '../lib/typings';
import { useIsMounted } from './useIsMounted';
import { useAccountIfMounted } from './useAccountIfMounted';

export const useAssetBalance = (
  asset?: AssetDetails | LRTDetails,
  opts: Parameters<typeof useBalance>[0] = {}
): ReturnType<typeof useBalance> => {
  const isMounted = useIsMounted();
  const { address } = useAccountIfMounted();
  const isEth = asset?.symbol === 'ETH';
  return useBalance({
    address,
    staleTime: 60000,
    token: isEth ? undefined : asset?.address,
    enabled: address && asset && isMounted,
    ...opts
  });
};
