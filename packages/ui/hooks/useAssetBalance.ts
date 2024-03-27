import {
  type Config,
  type UseBalanceParameters,
  type UseBalanceReturnType,
  useBalance
} from 'wagmi';
import { type GetBalanceData } from 'wagmi/query';
import { useAccountIfMounted } from './useAccountIfMounted';
import { useIsMounted } from './useIsMounted';
import { type AssetDetails, type LRTDetails } from '../lib/typings';
import { useSupportedChainId } from './useSupportedChainId';

export const useAssetBalance = (
  asset?: AssetDetails | LRTDetails,
  opts: UseBalanceParameters<Config, GetBalanceData> = {}
): UseBalanceReturnType<GetBalanceData> => {
  const isMounted = useIsMounted();
  const { address } = useAccountIfMounted();
  const chainId = useSupportedChainId();
  const isEth = asset?.symbol === 'ETH';
  return useBalance<Config, GetBalanceData>({
    address,
    token: isEth ? undefined : asset?.address,
    chainId,
    ...opts,
    query: {
      staleTime: 60000,
      enabled: address && asset && isMounted,
      ...opts?.query
    }
  });
};
