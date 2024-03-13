import {
  useEnsAvatar,
  type UseEnsAvatarParameters,
  type UseEnsAvatarReturnType
} from 'wagmi';

import { useIsMainnetSupported } from './useIsMainnetSupported';

export function useMainnetEnsAvatar<
  T extends Omit<UseEnsAvatarParameters, 'chainId'>
>({ name, ...config }: T): UseEnsAvatarReturnType {
  const isMainnetSupported = useIsMainnetSupported();
  return useEnsAvatar({
    name: isMainnetSupported ? name : undefined,
    ...config,
    chainId: 1,
    query: { enabled: isMainnetSupported }
  });
}
