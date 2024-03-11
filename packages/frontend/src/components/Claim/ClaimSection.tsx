import { Spinner } from '@material-tailwind/react';
import { useCallback, useEffect } from 'react';
import {
  useLiquidRestakingToken,
  type ClaimWithdrawalParams,
  type LiquidRestakingTokenClient
} from '@rionetwork/sdk-react';
import { useSubgraphConstractWrite } from '@rio-monorepo/ui/hooks/useSubgraphContractWrite';
import { useGetAccountWithdrawals } from '@rio-monorepo/ui/hooks/useGetAccountWithdrawals';
import { useTransactionButton } from '@rio-monorepo/ui/hooks/useTransactionButton';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { cn, displayEthAmount } from '@rio-monorepo/ui/lib/utilities';
import {
  RioTransactionType,
  type LRTDetails,
  type TokenSymbol
} from '@rio-monorepo/ui/lib/typings';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import ClaimButton from './ClaimButton';

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
    toasts: {
      sent: 'Claim transaction sent',
      error: 'Claim failed',
      success:
        formattedAmount !== '0'
          ? `Successfully claimed ${formattedAmount} ${claimAssetSymbol || ''}`
          : 'Claim successful'
    },
    disabled: !canClaim || isLoading || isWithdrawalsLoading,
    hash: txHash,
    error,
    refetch,
    write,
    isSigning: isLoading
  });

  return (
    <PageWrapper>
      <div
        className={cn(
          'flex justify-between items-center',
          'w-full p-2 rounded-[4px] shadow-cardlight',
          'bg-foregroundA1 text-foregroundA8 transition-colors',
          !!address &&
            !!claimAmount &&
            'bg-rio-blue text-background dark:text-foreground'
        )}
      >
        <div className="w-full flex justify-between items-center gap-4 text-base">
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
