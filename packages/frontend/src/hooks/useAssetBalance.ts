import { useAccount, useBalance } from 'wagmi';
import { AssetDetails, LRTDetails } from '../lib/typings';

export const useAssetBalance = (
  asset?: AssetDetails | LRTDetails,
  opts: Parameters<typeof useBalance>[0] = {}
) => {
  const { address } = useAccount();
  const isEth = asset?.symbol === 'ETH';
  return useBalance({
    address,
    staleTime: 60000,
    token: isEth ? undefined : asset?.address,
    enabled: !!asset?.address,
    ...opts
  });
};
