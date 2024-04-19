import {
  useEnsName,
  type UseEnsNameParameters,
  type UseEnsNameReturnType
} from 'wagmi';

import { useIsMainnetSupported } from './useIsMainnetSupported';

export function useMainnetEnsName<
  T extends Omit<UseEnsNameParameters, 'chainId'>
>({ address, ...config }: T): UseEnsNameReturnType {
  const isMainnetSupported = useIsMainnetSupported();
  return useEnsName({
    address: isMainnetSupported ? address : undefined,
    ...config,
    chainId: 1,
    query: {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: Infinity,
      refetchIntervalInBackground: Infinity,
      enabled: isMainnetSupported
    }
  });
}
