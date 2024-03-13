'use client';

import { useCallback, useMemo, useState } from 'react';
import { CaretSortIcon, GearIcon } from '@radix-ui/react-icons';
import { useDisconnect, useSwitchChain } from 'wagmi';
import { twJoin, twMerge } from 'tailwind-merge';
import Skeleton from 'react-loading-skeleton';
import { mainnet } from 'viem/chains';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  AlertTriangleIcon,
  CircleSlashIcon,
  CopyIcon,
  SatelliteDishIcon,
  SplitIcon,
  WalletIcon
} from 'lucide-react';

import { useWalletAndTermsStore } from '../../contexts/WalletAndTermsStore';
import { useRegisterHotKey } from '../../contexts/AppContext';
import { useAccountIfMounted } from '../../hooks/useAccountIfMounted';
import { useMainnetEnsName } from '../../hooks/useMainnetEnsName';
import { useRegionChecked } from '../../hooks/useRegionChecked';
import { useLocaleBalance } from '../../hooks/useLocaleBalance';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '../shadcn/dropdown-menu';

import { IconEtherscan } from '../Icons/IconEtherscan';
import { ContentFlipper } from './ContentFlipper';
import { EnsAvatar } from './EnsAvatar';
import {
  ConnectWalletButton,
  type ConnectWalletButtonRenderProps
} from './ConnectWalletButton';

import { abbreviateAddress } from '../../lib/utilities';

export function ConnectWalletMenu({ className }: { className?: string }) {
  const { address, chain } = useAccountIfMounted();
  const { disconnect } = useDisconnect();
  const [{ data: isInAllowedRegion }] = useRegionChecked();
  const { chains, switchChain } = useSwitchChain();
  const { data: balance } = useLocaleBalance({ address });
  const { openWalletModal } = useWalletAndTermsStore();
  const { data: ensName, isFetching: isEnsLoading } = useMainnetEnsName({
    address
  });

  const chainUnsupported = !!address && !chain;

  const [isOpen, setIsOpen] = useState(false);

  const name = ensName ?? abbreviateAddress(address);
  const etherscanUrl =
    chain?.blockExplorers?.default?.url ?? 'https://etherscan.io';
  const showUnsupportedRegion =
    chain?.id === mainnet.id && isInAllowedRegion === false;

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const goToEtherscan = useCallback(() => {
    if (address) {
      const url = `${etherscanUrl}/address/${address}`;
      global?.window?.open(url, '_blank')?.focus();
      setIsOpen(false);
    }
  }, [etherscanUrl, address]);

  const copyAddress = useCallback(async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast('Copied address to clipboard');
      setIsOpen(false);
    }
  }, [address]);

  const _ConnectWalletMenuTrigger = useMemo(
    () => BuildConnectWalletMenuTrigger(setIsOpen),
    []
  );

  useRegisterHotKey({
    shift: true,
    action: true,
    character: 'o',
    callback: goToEtherscan,
    enable: true
  });

  useRegisterHotKey({
    shift: true,
    action: true,
    character: 'u',
    callback: copyAddress,
    enable: true
  });

  useRegisterHotKey({
    action: true,
    character: 'I',
    callback: address ? toggleMenu : openWalletModal,
    enable: true
  });

  return (
    <DropdownMenu
      open={!address ? false : isOpen}
      onOpenChange={!address ? undefined : setIsOpen}
    >
      <ConnectWalletButton
        variant="outline"
        size="sm"
        className={className}
        onClick={!address ? undefined : () => {}}
        asTrigger="dropdown"
      >
        {_ConnectWalletMenuTrigger}
      </ConnectWalletButton>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex w-full items-center gap-2 font-semibold">
          <EnsAvatar size={12} />
          {isEnsLoading ? (
            <span className="max-h-4 [&>span]:block [&>span]:!h-4 -translate-y-px">
              <Skeleton height={16} width={48} className="h-[16px]" />
            </span>
          ) : (
            <span className="opacity-70 translate-y-px">{name}</span>
          )}
        </DropdownMenuLabel>

        <DropdownMenuItem
          disabled
          className="flex max-w-full items-center justify-between gap-3 overflow-hidden"
        >
          {!chainUnsupported && !showUnsupportedRegion && (
            <span className="flex shrink items-center gap-2 truncate text-xs">
              <WalletIcon className="h-3 w-3 min-w-3" />
              {balance ? (
                <span className="flex max-w-[calc(100%-20px)] items-center gap-1.5 truncate">
                  <span className="text-bold truncate translate-y-[0.5px]">
                    {balance.locale}
                  </span>
                  <span
                    className={twJoin(
                      'shrink-0',
                      'px-1 pb-0.5 pt-0.5',
                      ' rounded-[3px]',
                      'text-[11px] font-black leading-[11px]',
                      'bg-foreground bg-opacity-50 text-background',
                      'dark:text-foreground dark:bg-opacity-20 dark:border-opacity-10'
                    )}
                  >
                    {balance.symbol}
                  </span>
                </span>
              ) : (
                <Skeleton className="h-2 w-4" />
              )}
            </span>
          )}
          <span
            className={twMerge(
              'flex items-center gap-2 shrink-0 text-[11px]',
              (showUnsupportedRegion || chainUnsupported) &&
                'max-w-full text-xs text-destructive'
            )}
          >
            {chainUnsupported || showUnsupportedRegion ? (
              <AlertTriangleIcon className="h-3 w-3 [&_path]:stroke-destructive" />
            ) : (
              <SatelliteDishIcon className="h-3 w-3" />
            )}
            {chainUnsupported
              ? 'Unsupported network'
              : showUnsupportedRegion
              ? 'Unsupported region'
              : chain?.name}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled={!address} onSelect={copyAddress}>
          <CopyIcon className="mr-2 h-3 w-3" />
          Copy Address
          <DropdownMenuShortcut
            shift
            action
            character="u"
            callback={copyAddress}
            enable={false}
          />
        </DropdownMenuItem>

        <DropdownMenuItem disabled={!address} asChild>
          <Link
            href={`${etherscanUrl}/address/${address}`}
            target="_blank"
            rel="noreferrer noopener"
            className="flext w-full items-center"
          >
            <IconEtherscan className="mr-1 -translate-x-0.5 h-[16px] w-[16px]" />
            View on {chain?.blockExplorers?.default?.name ?? 'Explorer'}
            <DropdownMenuShortcut
              shift
              action
              character="o"
              callback={goToEtherscan}
              enable={false}
            />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {chains.length > 1 && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SplitIcon className="mr-2 h-3 w-3" />
              Change Network
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {chains?.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    disabled={c.id === chain?.id}
                    onSelect={() => switchChain?.({ chainId: c.id })}
                  >
                    {c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}

        {chains.length === 1 && chainUnsupported && (
          <DropdownMenuItem
            onSelect={() => switchChain?.({ chainId: chains?.[0].id })}
          >
            <SplitIcon className="mr-2 h-3 w-3" />
            Change Network
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onSelect={() => disconnect?.()}>
          <CircleSlashIcon className="mr-2 h-3 w-3" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BuildConnectWalletMenuTrigger(
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  return function ConnectWalletMenuTrigger({
    user: { address, name, avatarElement, isLoading }
  }: ConnectWalletButtonRenderProps) {
    return (
      <>
        {address ? (
          <ContentFlipper
            groupHover
            groupOpen
            className="w-[calc(190px-36px)] max-w-[calc(190px-36px)]"
            content={
              <span className="flex max-w-full items-center gap-2 truncate">
                {avatarElement}
                <span className="max-w-[calc(100%-23px)] text-xs translate-y-px truncate">
                  {isLoading ? <Skeleton height={16} width={48} /> : name}
                </span>
              </span>
            }
            flipContent={
              <span className="flex max-w-full items-center gap-2 truncate">
                <GearIcon className="h-3 w-3" />
                <span className="max-w-[calc(100%-23px)] text-xs translate-y-px truncate">
                  Options
                </span>
              </span>
            }
          />
        ) : (
          <span className="flex max-w-[calc(190px-40px)] items-center gap-2 truncate">
            <WalletIcon className="h-3 w-3" />
            <span className="text-xs translate-y-px truncate">Connect</span>
          </span>
        )}

        <div className="flex w-10 items-center overflow-hidden">
          <DropdownMenuShortcut
            className={twJoin(
              'overflow-hidden',
              !!address && [
                'group-hover:max-w-0 group-focus:max-w-0 group-rdx-state-open:max-w-0',
                'group-hover:opacity-0 group-focus:opacity-0 group-rdx-state-open:opacity-0'
              ]
            )}
            action
            character="I"
            enable={false}
            callback={() => setIsOpen((prev) => !prev)}
          />
          <CaretSortIcon
            className={twJoin(
              'h-4 w-0 opacity-0 transition-opacity',
              'overflow-hidden',
              !!address && [
                'group-focus:w-4',
                'group-hover:w-4',
                'group-rdx-state-open:w-4',
                'group-focus:opacity-50',
                'group-hover:opacity-50',
                'group-rdx-state-open:opacity-50'
              ]
            )}
          />
        </div>
      </>
    );
  };
}
