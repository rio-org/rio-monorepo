import { useAccount } from 'wagmi';
import { useIsMounted } from './useIsMounted';

export const useAccountIfMounted = (
  config?: Parameters<typeof useAccount>[0]
): ReturnType<typeof useAccount> => {
  const account = useAccount(config);
  return useIsMounted()
    ? account
    : {
        address: undefined,
        connector: undefined,
        isConnected: false,
        isReconnecting: false,
        isConnecting: false,
        isDisconnected: true,
        status: 'disconnected'
      };
};
