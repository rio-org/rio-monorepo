import {
  type Config,
  type UseAccountReturnType,
  type ResolvedRegister,
  type UseAccountParameters,
  useAccount
} from 'wagmi';
import { useIsMounted } from './useIsMounted';

export const useAccountIfMounted = <
  config extends Config = ResolvedRegister['config']
>(
  config: UseAccountParameters<config> = {}
): UseAccountReturnType<config> => {
  const account = useAccount(config);
  return useIsMounted()
    ? account
    : {
        address: undefined,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        connector: undefined,
        isConnected: false,
        isReconnecting: false,
        isConnecting: false,
        isDisconnected: true,
        status: 'disconnected'
      };
};
