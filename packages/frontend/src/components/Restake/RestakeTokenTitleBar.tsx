import Skeleton from 'react-loading-skeleton';
import { useReadContracts, useWalletClient } from 'wagmi';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { IconArrowDiagonal } from '@rio-monorepo/ui/components/Icons/IconArrowDiagonal';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useSupportedChainId } from '@rio-monorepo/ui/hooks/useSupportedChainId';
import { IconEtherscan } from '@rio-monorepo/ui/components/Icons/IconEtherscan';
import { IconFileBox } from '@rio-monorepo/ui/components/Icons/IconFileBox';
import { IconWallet } from '@rio-monorepo/ui/components/Icons/IconWallet';
import { IconGlobe } from '@rio-monorepo/ui/components/Icons/IconGlobe';
import { IconCopy } from '@rio-monorepo/ui/components/Icons/IconCopy';
import { Button } from '@rio-monorepo/ui/components/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@rio-monorepo/ui/components/shadcn/dropdown-menu';

import { linkToAddressOnBlockExplorer } from '@rio-monorepo/ui/lib/utilities';
import { RESTAKING_TOKEN_NAV_ITEMS } from '@rio-monorepo/ui/config';
import { LRTDetails } from '@rio-monorepo/ui/lib/typings';
import {
  ContractDeployment,
  LiquidRestakingTokenClient,
  useSubgraph
} from '@rionetwork/sdk-react';
import { Address } from 'viem';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@rio-monorepo/ui/components/shadcn/dialog';
import { ContractAddressField } from '@rio-monorepo/ui/components/Shared/ContractAddressField';
import { twJoin } from 'tailwind-merge';

export interface RestakeTokenTitleBarProps {
  lrtDetails?: LRTDetails;
  restakingTokenClient?: LiquidRestakingTokenClient | null;
}

export function RestakeTokenTitleBar({
  lrtDetails,
  restakingTokenClient
}: RestakeTokenTitleBarProps) {
  const subgraph = useSubgraph();
  const supportedChainId = useSupportedChainId();
  const { address } = useAccountIfMounted();
  const [contracts, setContracts] =
    useState<
      Partial<
        ContractDeployment & { issuer: Address; operatorDelegator: Address }
      >
    >();

  const copyAddress = useCallback(async () => {
    if (lrtDetails?.address && navigator.clipboard) {
      await navigator.clipboard.writeText(lrtDetails?.address);
      toast('Copied address to clipboard');
    }
  }, [lrtDetails?.address]);

  const { data: walletClient } = useWalletClient();
  const addTokenToWallet = useCallback(async () => {
    if (!walletClient || !lrtDetails) return;

    try {
      await walletClient?.watchAsset({
        type: 'ERC20',
        options: {
          address: lrtDetails.address,
          symbol: lrtDetails.symbol,
          decimals: lrtDetails.decimals
        }
      });
    } catch (error) {
      toast('Failed to add token to wallet');
    }
  }, [walletClient, lrtDetails]);

  useEffect(() => {
    if (contracts?.issuer || !subgraph) return;
    subgraph
      .getIssuer()
      .then((issuer) =>
        setContracts((prev) => ({ ...prev, issuer: issuer.address as Address }))
      );
  }, [contracts?.issuer, subgraph]);

  useEffect(() => {
    if (!restakingTokenClient?.token) return;
    setContracts((prev) => ({
      ...prev,
      ...restakingTokenClient.token.deployment
    }));
  }, [restakingTokenClient?.token]);

  console.log(contracts);

  return (
    <Dialog>
      <div className="flex items-center justify-between pb-4">
        <h2 className="flex gap-2 items-center flex-start text-foreground text-base font-medium">
          <span className="leading-snug">
            {lrtDetails?.name ?? <Skeleton height={16} width={111} />}
          </span>
          <span className="font-mono leading-none opacity-20">
            {lrtDetails?.symbol ?? <Skeleton height={16} width={55} />}
          </span>
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger disabled={!lrtDetails} asChild>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-[3px] aspect-square w-7 h-7 p-0"
            >
              <div className="rounded-full bg-foreground opacity-70 w-[3px] h-[3px]" />
              <div className="rounded-full bg-foreground opacity-70 w-[3px] h-[3px]" />
              <div className="rounded-full bg-foreground opacity-70 w-[3px] h-[3px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem
              disabled
              className="flex items-center justify-between gap-6 w-full"
            >
              <span className="">{lrtDetails?.name}</span>
              <span className="opacity-50">{lrtDetails?.symbol}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center justify-start gap-1.5 w-full"
              onClick={copyAddress}
            >
              <IconCopy className="mr-0.5" />
              <span>Copy address</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-start gap-1.5 w-full"
              asChild
            >
              <DialogTrigger>
                <IconFileBox className="mr-0.5" />
                <span>View contracts</span>
              </DialogTrigger>
            </DropdownMenuItem>
            {!!address && (
              <DropdownMenuItem
                className="flex items-center justify-start gap-1.5 w-full"
                onClick={addTokenToWallet}
              >
                <IconWallet className="mr-0.5" />
                <span>Add {lrtDetails?.symbol} to wallet</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="w-full" asChild>
              <a
                className="flex items-center justify-start gap-1.5 w-full"
                href={
                  !lrtDetails?.address
                    ? undefined
                    : linkToAddressOnBlockExplorer(
                        lrtDetails?.address,
                        supportedChainId
                      )
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconEtherscan className="-ml-0.5" />
                <span className="flex items-center gap-0.5">
                  <span>View on Etherscan</span>
                  <IconArrowDiagonal className="opacity-50" />
                </span>
              </a>
            </DropdownMenuItem>
            {lrtDetails?.symbol &&
              RESTAKING_TOKEN_NAV_ITEMS[lrtDetails.symbol] && (
                <DropdownMenuItem
                  className="flex items-center justify-start gap-1.5 w-full"
                  asChild
                >
                  <a
                    className="flex items-center justify-start gap-1.5 w-full"
                    href={RESTAKING_TOKEN_NAV_ITEMS[lrtDetails.symbol].url}
                    target={
                      RESTAKING_TOKEN_NAV_ITEMS[lrtDetails.symbol].external
                        ? '_blank'
                        : undefined
                    }
                    rel={
                      RESTAKING_TOKEN_NAV_ITEMS[lrtDetails.symbol].external
                        ? 'noopener noreferrer'
                        : undefined
                    }
                  >
                    <IconGlobe
                      width={12}
                      height={12}
                      className="[&>path]:stroke-foreground mr-0.5"
                    />
                    <span className="flex items-center gap-0.5">
                      <span>More information</span>
                      <IconArrowDiagonal className="opacity-50" />
                    </span>
                  </a>
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DialogContent className="w-[670px] max-w-full max-h-screen overflow-auto">
        <DialogHeader className="text-left">
          <DialogTitle>Restaked Ether Contracts</DialogTitle>
          <DialogDescription>
            Contracts related to the management of the Restaked Ether token and
            its ecosystem. You can view more information about each contract by
            viewing our{' '}
            <a
              href="https://docs.rio.network/rio-architecture/rio-lrt-ecosystem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline inline-flex items-center"
            >
              <span>documentation</span>
              <IconArrowDiagonal className="opacity-80" />
            </a>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="w-full max-w-full space-y-4 overflow-x-hidden mt-4">
          <ContractRow
            addresses={[
              { title: 'RioLRT', value: lrtDetails?.address },
              { title: 'RioLRTIssuer', value: contracts?.issuer }
            ]}
          />
          <ContractRow
            addresses={[
              { title: 'RioLRTCoordinator', value: contracts?.coordinator },
              { title: 'RioLRTAssetRegistry', value: contracts?.assetRegistry }
            ]}
          />
          <ContractRow
            addresses={[
              {
                title: 'RioLRTOperatorRegistry',
                value: contracts?.operatorRegistry
              },
              { title: 'RioLRTAVSRegistry', value: contracts?.avsRegistry }
            ]}
          />
          <ContractRow
            addresses={[
              { title: 'RioLRTDepositPool', value: contracts?.depositPool },
              {
                title: 'RioLRTWithdrawalQueue',
                value: contracts?.withdrawalQueue
              }
            ]}
          />
          <ContractRow
            addresses={[
              {
                title: 'RioLRTRewardDistributor',
                value: contracts?.rewardDistributor
              },
              undefined
            ]}
          />
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button size="sm">Close</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ContractRow({
  addresses
}: {
  addresses: [
    { title: string; value?: string },
    { title: string; value?: string } | undefined
  ];
}) {
  return (
    <div
      className={twJoin(
        'flex flex-col sm:flex-row gap-4 w-full max-w-full',
        '[&>div]:max-w-full [&>div]:w-full [&>div]:sm:w-[calc(50%-0.5rem)] [&>div]:sm:max-w-[calc(50%-0.5rem)]'
      )}
    >
      <div>
        <ContractAddressField
          title={addresses[0].title}
          value={addresses[0].value}
          monospaceBoxClassName="w-full max-w-full"
          className="w-full max-w-full"
        />
      </div>
      <div>
        {addresses[1] && (
          <ContractAddressField
            title={addresses[1].title}
            value={addresses[1].value}
            monospaceBoxClassName="w-full"
            className="w-full max-w-full"
          />
        )}
      </div>
    </div>
  );
}
