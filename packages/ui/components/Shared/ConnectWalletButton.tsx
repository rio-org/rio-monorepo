'use client';

import { useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { AlertTriangleIcon, WalletIcon } from 'lucide-react';
import { type Chain, mainnet } from 'viem/chains';
import { twJoin, twMerge } from 'tailwind-merge';
import Skeleton from 'react-loading-skeleton';
import { memo, useMemo } from 'react';

import { FramerButton, type FramerButtonProps } from '../shadcn/button';
import { DropdownMenuTrigger } from '../shadcn/dropdown-menu';
import { DrawerTrigger } from '../shadcn/drawer';

import { EnsAvatar } from './EnsAvatar';

import { useWalletAndTermsStore } from '../../contexts/WalletAndTermsStore';
import { useIsMainnetSupported } from '../../hooks/useIsMainnetSupported';
import { useAccountIfMounted } from '../../hooks/useAccountIfMounted';
import { useMainnetEnsName } from '../../hooks/useMainnetEnsName';
import { useRegionChecked } from '../../hooks/useRegionChecked';
import { useIsMounted } from '../../hooks/useIsMounted';
import { abbreviateAddress } from '../../lib/utilities';

export interface ConnectWalletButtonRenderProps {
  user: {
    address: `0x${string}` | undefined;
    name: string | null;
    avatarElement: React.ReactNode;
    isLoading: boolean;
    isInAllowedRegion: boolean | null | undefined;
    chain: Chain | undefined;
  };
}

export interface ConnectWalletButtonProps
  extends Omit<FramerButtonProps, 'children'> {
  asTrigger?: 'drawer' | 'dropdown';
  children?:
    | ((
        props: ConnectWalletButtonRenderProps
      ) => React.ReactNode | React.ReactNode[])
    | React.ReactNode
    | React.ReactNode[];
  hoverText?: string;
}

export function ConnectWalletButton({
  className,
  variant = 'secondary',
  size = 'sm',
  children,
  onClick,
  asTrigger,
  ...props
}: ConnectWalletButtonProps) {
  const isMainnetSupported = useIsMainnetSupported();
  const { address, chain, isConnected, isConnecting, isReconnecting } =
    useAccountIfMounted();

  const { openWalletModal } = useWalletAndTermsStore();
  const [{ data: isInAllowedRegion }] = useRegionChecked();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const isMounted = useIsMounted();

  const chainUnsupported = !!address && !chain;
  const unsupportedRegionOnMainnet =
    chain?.id === mainnet.id && isInAllowedRegion === false;

  const { data: ensName, isLoading: isEnsLoading } = useMainnetEnsName({
    address: isMainnetSupported ? address : undefined,
    chainId: 1
  });

  const name = ensName ?? abbreviateAddress(address);
  const connectionLoading = isConnecting || isReconnecting;
  const isNotConnected = !isConnected && !connectionLoading;

  const avatarElement = useMemo(
    () =>
      chainUnsupported || unsupportedRegionOnMainnet ? (
        <AlertTriangleIcon className="h-3 w-3" />
      ) : (
        <EnsAvatar />
      ),
    [chainUnsupported, unsupportedRegionOnMainnet]
  );

  return (
    <ConnectWalletButtonContainer asTrigger={asTrigger}>
      <FramerButton
        variant={variant}
        size={size}
        style={{
          width: !address ? '10rem' : isMounted ? '14rem' : '7.5rem',
          maxWidth: !address ? '10rem' : isMounted ? '14rem' : '7.5rem'
        }}
        className={twMerge(
          twJoin(
            'group relative',
            'flex justify-between items-center gap-2',
            'h-8 min-w-28',
            'font-mono font-semibold',
            'transition-all will-change-auto',
            !isMounted && 'px-0',
            (unsupportedRegionOnMainnet || chainUnsupported) &&
              'border-destructive',
            (unsupportedRegionOnMainnet || chainUnsupported) &&
              variant &&
              (['outline', 'ghost'].includes(variant)
                ? 'text-destructive'
                : 'text-destructive-foreground bg-destructive')
          ),
          className
        )}
        disabled={!isMounted}
        onClick={
          onClick ??
          (isNotConnected
            ? openWalletModal
            : chainUnsupported
            ? openChainModal
            : openAccountModal)
        }
        {...props}
      >
        {!isMounted ? (
          <Skeleton className="h-full w-full" />
        ) : typeof children === 'function' ? (
          children?.({
            user: {
              address,
              name,
              avatarElement,
              isLoading: isMainnetSupported ? isEnsLoading : false,
              isInAllowedRegion,
              chain
            }
          })
        ) : (
          children ?? (
            <span className="inline-flex max-w-full items-center gap-2 truncate leading-none">
              {address ? (
                <>
                  {avatarElement}
                  {isEnsLoading ? <Skeleton className="h-4 w-12" /> : name}
                </>
              ) : (
                <>
                  <WalletIcon className="h-3 w-3" />
                  Connect
                </>
              )}
            </span>
          )
        )}
      </FramerButton>
    </ConnectWalletButtonContainer>
  );
}

const ConnectWalletButtonContainer = memo(
  ({
    children,
    asTrigger
  }: {
    children: React.ReactNode;
    asTrigger?: ConnectWalletButtonProps['asTrigger'];
  }) => {
    switch (asTrigger) {
      case 'dropdown':
        return <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>;
      case 'drawer':
        return <DrawerTrigger asChild>{children}</DrawerTrigger>;
      default:
        return <>{children}</>;
    }
  }
);
ConnectWalletButtonContainer.displayName = 'ConnectWalletButtonContainer';
