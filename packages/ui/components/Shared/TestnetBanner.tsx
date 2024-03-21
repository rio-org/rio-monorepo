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
  const goerliExists = chains?.find((c) => c.id === goerli.id);
  return (
    <AnimatePresence>
      {(goerliExists || (chain?.testnet && mainnet)) && (
        <Banner
          accordion={!!goerliExists}
          icon={
            goerliExists ? undefined : <SatelliteDishIcon className="h-4 w-4" />
          }
          title={
            goerliExists ? 'Goerli Testnet Disruptions' : 'Connected to testnet'
          }
          type="warning"
          className={className}
          actionComponent={
            !mainnet ? null : (
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
            )
          }
        >
          {goerliExists ? (
            <>
              The Rio Network and EigenLayer rely on the Goerli Ethereum testnet
              that is currently in a degraded state. Please take note that
              transactions may fail or take a long time to confirm. We will
              launch on the Holesky testnet alongside EigenLayer.
            </>
          ) : (
            <>Switch to mainnet</>
          )}
        </Banner>
      )}
    </AnimatePresence>
  );
}