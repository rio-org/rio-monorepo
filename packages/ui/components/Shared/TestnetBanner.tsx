import { SatelliteDishIcon } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { twJoin } from 'tailwind-merge';
import { useSwitchChain } from 'wagmi';
import { goerli } from 'viem/chains';
import { useAccountIfMounted } from '../../hooks/useAccountIfMounted';
import { Button } from '../shadcn/button';
import { Banner } from './Banner';

export function TestnetBanner({ className }: { className?: string }) {
  const { chain } = useAccountIfMounted();
  const { chains, switchChain, isPending } = useSwitchChain();
  const mainnet = chains?.find((c) => c.id === 1);
  const isGoerli = chain?.id === goerli.id;
  return (
    <AnimatePresence>
      {isGoerli && (
        <Banner type="warning" className={className}>
          Goerli is currently experiencing disruptions. Transactions may fail or
          take a long time to confirm.
        </Banner>
      )}
      {!isGoerli && chain?.testnet && mainnet && (
        <Banner
          icon={<SatelliteDishIcon className="h-4 w-4" />}
          type="warning"
          className={className}
          actionComponent={
            <Button
              variant="link"
              disabled={isPending}
              onClick={() => switchChain({ chainId: mainnet.id })}
              className={twJoin(
                'py-0 h-[unset] px-0',
                'text-xs text-warning-foreground font-medium underline leading-none',
                'transition-opacity opacity-80 hover:opacity-100 focus:opacity-100'
              )}
            >
              Switch to mainnet
            </Button>
          }
        >
          Connected to testnet
        </Banner>
      )}
    </AnimatePresence>
  );
}
