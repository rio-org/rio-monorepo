import { Spinner } from '@material-tailwind/react';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useGetAccountWithdrawals } from '@rio-monorepo/ui/hooks/useGetAccountWithdrawals';
import { useSubgraphConstractWrite } from '@rio-monorepo/ui/hooks/useSubgraphContractWrite';
import {
  RioTransactionType,
  type LRTDetails,
  type TokenSymbol
} from '@rio-monorepo/ui/lib/typings';
import {
  cn,
  displayEthAmount,
  linkToTxOnBlockExplorer
} from '@rio-monorepo/ui/lib/utilities';
import {
  ClaimWithdrawalParams,
  LiquidRestakingTokenClient,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { useCallback, useEffect } from 'react';
import ClaimButton from './ClaimButton';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import dayjs from 'dayjs';
import { twJoin } from 'tailwind-merge';
import IconExternal from '@rio-monorepo/ui/components/Icons/IconExternal';
import { Hash } from 'viem';
import { CHAIN_ID } from '@rio-monorepo/ui/config';
import { toast } from 'sonner';
import { IconSad } from '@rio-monorepo/ui/components/Icons/IconSad';
import { useTransactionButton } from '@rio-monorepo/ui/hooks/useTransactionButton';
import { useNetwork } from 'wagmi';
import { IconLightning } from '@rio-monorepo/ui/components/Icons/IconLightning';
import { IconParty } from '@rio-monorepo/ui/components/Icons/IconParty';

interface ClaimSectionProps {
  withdrawalAssets: { amount: number; symbol: TokenSymbol }[];
  withdrawalParams: ClaimWithdrawalParams[];
  refetch: ReturnType<typeof useGetAccountWithdrawals>['refetch'];
  restakingToken?: LRTDetails;
  isWithdrawalsLoading: boolean;
}

export function ClaimSection({
  withdrawalAssets,
  withdrawalParams,
  refetch,
  restakingToken,
  isWithdrawalsLoading
}: ClaimSectionProps) {
  if (restakingToken) {
    return (
      <ClaimSectionWithRestakingToken
        withdrawalAssets={withdrawalAssets}
        withdrawalParams={withdrawalParams}
        restakingToken={restakingToken}
        refetch={refetch}
        isWithdrawalsLoading={isWithdrawalsLoading}
      />
    );
  }
  return (
    <ClaimSectionBase
      withdrawalAssets={withdrawalAssets}
      withdrawalParams={withdrawalParams}
      restakingToken={restakingToken}
      refetch={refetch}
      isWithdrawalsLoading={isWithdrawalsLoading}
    />
  );
}

export function ClaimSectionWithRestakingToken({
  withdrawalAssets,
  withdrawalParams,
  restakingToken,
  refetch,
  isWithdrawalsLoading
}: Omit<ClaimSectionProps, 'restakingToken'> & { restakingToken: LRTDetails }) {
  const lrtClient = useLiquidRestakingToken(restakingToken.address);
  return (
    <ClaimSectionBase
      withdrawalAssets={withdrawalAssets}
      withdrawalParams={withdrawalParams}
      restakingToken={restakingToken}
      lrtClient={lrtClient}
      refetch={refetch}
      isWithdrawalsLoading={isWithdrawalsLoading}
    />
  );
}

export function ClaimSectionBase({
  withdrawalAssets,
  withdrawalParams,
  restakingToken,
  lrtClient,
  refetch,
  isWithdrawalsLoading
}: ClaimSectionProps & { lrtClient?: LiquidRestakingTokenClient | null }) {
  const { address } = useAccountIfMounted();
  const { chain } = useNetwork();
  const execute = useCallback(async () => {
    if (!lrtClient || !address || !withdrawalParams) return;

    return withdrawalParams.length !== 1
      ? lrtClient.claimWithdrawalsForManyEpochs(withdrawalParams)
      : lrtClient.claimWithdrawalsForEpoch(withdrawalParams[0]);
  }, [lrtClient, address, withdrawalParams]);

  const onReset = useCallback(async () => {
    return refetch().catch(console.error);
  }, [refetch]);

  const canClaim = !!address && !!lrtClient && withdrawalParams?.length > 0;

  const { txHash, isLoading, error, success, write, reset } =
    useSubgraphConstractWrite({
      execute,
      onReset,
      enabled: canClaim
    });

  useEffect(() => void (success && onReset()), [success, onReset]);
  useEffect(() => void (error && reset()), [error, reset]);

  const claimAmount = isWithdrawalsLoading
    ? undefined
    : withdrawalAssets.reduce((a, b) => a + b.amount, 0);

  const claimAssetSymbol = !restakingToken?.symbol
    ? ''
    : withdrawalAssets.length > 1
    ? `＊${restakingToken.symbol.match(/[A-Z]+$/)?.[0] || 'ETH'}`
    : withdrawalAssets[0]?.symbol;

  const formattedAmount = displayEthAmount(claimAmount?.toString() ?? '0');

  const useTransactionButtonReturn = useTransactionButton({
    transactionType: RioTransactionType.CLAIM,
    disabled: !canClaim || isLoading || isWithdrawalsLoading,
    hash: txHash,
    error,
    refetch,
    write,
    isSigning: isLoading
  });

  useEffect(
    function emitTxSentToast() {
      if (!txHash || !useTransactionButtonReturn.isTxLoading) return;
      toast(
        <ToastContent
          icon={<IconLightning />}
          title="Claim transaction sent"
          hash={txHash}
          chainId={chain?.id}
        />
      );
    },
    [txHash, useTransactionButtonReturn.isTxLoading]
  );

  useEffect(
    function emitTxSuccessToast() {
      if (!txHash || !useTransactionButtonReturn.isTxSuccess || !claimAmount) {
        return;
      }

      toast(
        <ToastContent
          icon={<IconParty />}
          title={
            formattedAmount !== '0'
              ? `Successfully claimed ${formattedAmount} ${
                  claimAssetSymbol || ''
                }`
              : 'Claim successful'
          }
          hash={txHash}
          chainId={chain?.id}
        />
      );
    },
    [
      txHash,
      useTransactionButtonReturn.isTxSuccess,
      formattedAmount,
      claimAssetSymbol
    ]
  );

  useEffect(
    function emitTxErrorToast() {
      if (!useTransactionButtonReturn.errorMessage) return;
      reset?.();
      toast(
        <ToastContent
          icon={<IconSad />}
          title={
            txHash ? 'Claim failed' : useTransactionButtonReturn.errorMessage
          }
          hash={txHash}
          chainId={chain?.id}
        />
      );
    },
    [txHash, useTransactionButtonReturn.errorMessage, !!reset, !!refetch]
  );

  return (
    <PageWrapper>
      <div
        className={cn(
          'flex justify-between items-center',
          'w-full p-2 mt-4 rounded-2xl',
          'bg-[var(--color-element-wrapper-bg)] text-blackA8 transition-colors',
          !!address && !!claimAmount && 'bg-[#301FC4] text-white'
        )}
      >
        <div className="w-full flex justify-between items-center gap-4 text-[14px]">
          <h3 className="flex items-center gap-1 font-medium pl-2 lg:pl-3">
            {isWithdrawalsLoading ? (
              <>
                <Spinner /> <span>Pending requests loading</span>
              </>
            ) : (
              <>
                {claimAmount && address
                  ? `Claim available`
                  : 'No claims available'}
              </>
            )}
          </h3>

          <ClaimButton
            isSigning={isLoading}
            claimAmount={claimAmount?.toString()}
            claimAssetSymbol={claimAssetSymbol}
            useTransactionButtonReturn={useTransactionButtonReturn}
          />
        </div>
      </div>
    </PageWrapper>
  );
}

function ToastContent({
  icon,
  title,
  hash,
  chainId = CHAIN_ID
}: {
  icon: React.ReactNode;
  title: string;
  hash?: Hash;
  chainId?: number;
}) {
  return (
    <div className="flex gap-4 whitespace-nowrap items-center justify-between font-medium w-full">
      <div className="text-[14px] space-y-1.5">
        <span className="flex items-center gap-1 font-medium">
          {icon} <span>{title}</span>
        </span>
        <span className="font-normal opacity-50">
          {dayjs().format('MMMM D, YYYY * h:mm A').replace(/\*/, 'at')}
        </span>
      </div>
      {!hash ? (
        <div />
      ) : (
        <a
          className={twJoin(
            'flex items-center gap-1.5',
            'h-6 px-2 py-1',
            'bg-blackA2 rounded-[4px] text-xs text-black',
            'opacity-50 hover:opacity-90 active:opacity-100'
          )}
          href={linkToTxOnBlockExplorer(hash, chainId)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>View</span>
          <IconExternal className="w-[10px] h-[10px]" />
        </a>
      )}
    </div>
  );
}
