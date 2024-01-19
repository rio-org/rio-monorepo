import { useAccount, useBalance } from 'wagmi';
import { AssetDetails, LRTDetails } from '../lib/typings';
import { useIsMounted } from './useIsMounted';

export const useAssetBalance = (
  asset?: AssetDetails | LRTDetails,
  opts: Parameters<typeof useBalance>[0] = {}
): ReturnType<typeof useBalance> => {
  const isMounted = useIsMounted();
  const { address } = useAccount();
  const isEth = asset?.symbol === 'ETH';
  return useBalance({
    address,
    staleTime: 60000,
    token: isEth ? undefined : asset?.address,
    enabled: address && asset && isMounted,
    ...opts
  });
};
