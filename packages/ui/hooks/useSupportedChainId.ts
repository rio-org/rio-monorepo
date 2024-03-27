import { useConfig } from 'wagmi';
import { useAccountIfMounted } from './useAccountIfMounted';

export const useSupportedChainId = () => {
  const { chain } = useAccountIfMounted();
  const { chains } = useConfig();
  return (chains.find((c) => c.id === chain?.id) || chains[0]).id;
};
