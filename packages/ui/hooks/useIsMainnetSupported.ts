import { mainnet } from 'viem/chains';
import { useConfig } from 'wagmi';

export function useIsMainnetSupported() {
  const { chains } = useConfig();
  return !!chains.find((c) => c.id === mainnet.id);
}
