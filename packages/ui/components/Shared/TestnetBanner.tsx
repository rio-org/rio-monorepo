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
  const holesky = chains?.find((c) => c.id === 17000);
  const isGoerli = chain?.id === goerli.id;
  const mainNetwork = isGoerli && holesky && !mainnet ? holesky : mainnet;
  return (
    <AnimatePresence>
      {(isGoerli || (chain?.testnet && mainnet)) && (
        <Banner
          accordion={!!isGoerli}
          icon={
            isGoerli ? undefined : <SatelliteDishIcon className="h-4 w-4" />
          }
          title={
            isGoerli ? 'Goerli Testnet Disruptions' : 'Connected to testnet'
          }
          type="warning"
          className={className}
          actionComponent={
            mainNetwork && (
              <Button
                variant="link"
                disabled={isPending}
                onClick={() => switchChain({ chainId: mainNetwork.id })}
                className={twJoin(
                  'py-0 h-[unset] px-0',
                  'text-xs text-warning-foreground font-medium underline leading-none',
                  'transition-opacity opacity-80 hover:opacity-100 focus:opacity-100'
                )}
              >
                Switch to {mainNetwork.name}
              </Button>
            )
          }
        >
          {isGoerli ? (
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
