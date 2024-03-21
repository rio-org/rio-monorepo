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

export const useAssetBalance = (
  asset?: AssetDetails | LRTDetails,
  opts: UseBalanceParameters<Config, GetBalanceData> = {}
): UseBalanceReturnType<GetBalanceData> => {
  const isMounted = useIsMounted();
  const { address } = useAccountIfMounted();
  const isEth = asset?.symbol === 'ETH';
  return useBalance<Config, GetBalanceData>({
    address,
    token: isEth ? undefined : asset?.address,
    ...opts,
    query: {
      staleTime: 60000,
      enabled: address && asset && isMounted,
      ...opts?.query
    }
  });
};
