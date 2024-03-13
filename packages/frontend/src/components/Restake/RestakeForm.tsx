import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import Skeleton from 'react-loading-skeleton';
import { useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import {
  type LRTDetails,
  RioTransactionType,
  AssetDetails
} from '@rio-monorepo/ui/lib/typings';
import {
  type LiquidRestakingTokenClient,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { RestakingTokenExchangeRate } from '@rio-monorepo/ui/components/Shared/RestakingTokenExchangeRate';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import ApproveButtons from '@rio-monorepo/ui/components/Shared/ApproveButtons';
import { InfoTooltip } from '@rio-monorepo/ui/components/Shared/InfoTooltip';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import {
  displayAmount,
  displayEthAmount
} from '@rio-monorepo/ui/lib/utilities';
import { useRestakeForm } from '../../hooks/useRestakeForm';
import { useWithdrawForm } from '../../hooks/useWithdrawForm';
import { TabCard } from '@rio-monorepo/ui/components/Shared/TabCard';
import { InfoBadge } from '@rio-monorepo/ui/components/Shared/InfoBadge';
import { IconMedal } from '@rio-monorepo/ui/components/Icons/IconMedal';
import { IconChart } from '@rio-monorepo/ui/components/Icons/IconChart';
// import { TabsContent } from '@rio-monorepo/ui/components/shadcn/tabs';
import RestakeField from './RestakeField';
import { DetailBox } from '@rio-monorepo/ui/components/Shared/DetailBox';
import { MOBILE_MQ } from '@rio-monorepo/ui/lib/constants';

export function RestakeForm({
  lrtDetails,
  networkStats,
  onWithdrawSuccess
}: {
  lrtDetails?: LRTDetails;
  onWithdrawSuccess?: () => void;
  networkStats: { tvl: string | null; apy: string | null };
}) {
  if (lrtDetails) {
    return (
      <RestakeFormWithLRTWrapper
        lrtDetails={lrtDetails}
        onWithdrawSuccess={onWithdrawSuccess}
        networkStats={networkStats}
      />
    );
  }

  return (
    <RestakeFormBase
      lrtDetails={lrtDetails}
      restakingTokenClient={null}
      onWithdrawSuccess={onWithdrawSuccess}
      networkStats={networkStats}
    />
  );
}

function RestakeFormWithLRTWrapper({
  lrtDetails,
  networkStats,
  onWithdrawSuccess
}: {
  lrtDetails: LRTDetails;
  onWithdrawSuccess?: () => void;
  networkStats: { tvl: string | null; apy: string | null };
}) {
  const restakingTokenClient = useLiquidRestakingToken(lrtDetails.address);
  return (
    <RestakeFormBase
      restakingTokenClient={restakingTokenClient}
      lrtDetails={lrtDetails}
      onWithdrawSuccess={onWithdrawSuccess}
      networkStats={networkStats}
    />
  );
}

function RestakeFormBase({
  restakingTokenClient,
  lrtDetails,
  networkStats,
  onWithdrawSuccess
}: {
  restakingTokenClient: LiquidRestakingTokenClient | null;
  lrtDetails?: LRTDetails;
  onWithdrawSuccess?: () => void;
  networkStats: { tvl: string | null; apy: string | null };
}) {
  const { address } = useAccountIfMounted();
  const [restakeInputAmount, setRestakeInputAmount] = useState<string>('');
  const [withdrawInputAmount, setWithdrawInputAmount] = useState<string>('');
  const [tab, setTab] = useState<string>('Restake');
  const assets = useMemo(() => {
    return lrtDetails?.underlyingAssets.map((t) => t.asset) || [];
  }, [lrtDetails]);
  const [activeToken, setActiveToken] = useState<AssetDetails>(assets?.[0]);

  const isMobile = useMediaQuery({ query: MOBILE_MQ });

  const {
    contractWrite: withdrawWrite,
    restakingTokenBalance,
    // balanceError,
    handleChangeAmount,
    // resetForm,
    // isValidAmount,
    // amount,
    // amountOut,
    // refetch
    ...withdrawForm
  } = useWithdrawForm({
    inputAmount: withdrawInputAmount,
    activeToken,
    assets,
    restakingTokenClient,
    lrtDetails,
    setInputAmount: setWithdrawInputAmount,
    onSuccess: onWithdrawSuccess
  });

  const { contractWrite: restakeWrite, ...restakeForm } = useRestakeForm({
    lrtDetails,
    restakingTokenClient,
    inputAmount: restakeInputAmount,
    setInputAmount: setRestakeInputAmount,
    assets,
    activeToken,
    setActiveToken
  });

  const estimatedWithdrawalAmount = useMemo(
    () => (
      <strong className="flex flex-row gap-2 items-center leading-none">
        {tab === 'Restake' ? (
          <>
            {typeof restakeForm.minAmountOut !== 'bigint' ? (
              <Skeleton width={40} />
            ) : (
              displayEthAmount(
                formatUnits(
                  restakeForm.minAmountOut,
                  restakeForm.activeToken?.decimals ?? 18
                )
              )
            )}
          </>
        ) : (
          <>
            {!activeToken ? (
              <Skeleton width={40} />
            ) : (
              <>
                {withdrawForm.amount
                  ? displayEthAmount(
                      formatUnits(withdrawForm.amount, activeToken.decimals)
                    )
                  : displayEthAmount(
                      formatUnits(BigInt(0), activeToken.decimals)
                    )}
              </>
            )}
          </>
        )}
        <span className="leading-none">
          {(tab === 'Restake' ? lrtDetails?.symbol : activeToken?.symbol) || (
            <Skeleton className="w-6 h-3.5" />
          )}
        </span>
      </strong>
    ),
    [
      tab,
      withdrawForm.amount,
      restakeForm.minAmountOut,
      lrtDetails,
      activeToken
    ]
  );

  return (
    <>
      <TabCard
        tabs={['Restake', 'Withdraw']}
        defaultValue={tab}
        onValueChange={setTab}
        cardProps={{ className: 'p-4' }}
        tabDetails={
          <div className="flex justify-between items-center w-full md:justify-start md:w-[unset] gap-6">
            <InfoBadge
              icon={
                <IconMedal strokeWidth={1} className="-translate-y-[1px]" />
              }
              title="TVL"
              infoTooltipContent={
                <p>
                  The <strong>Total Value Locked (TVL)</strong> represents the
                  total amount of assets underlying the reETH token.
                </p>
              }
            >
              {networkStats.tvl}
            </InfoBadge>
            <InfoBadge
              icon={<IconChart className="-translate-y-[1px]" />}
              title="Rewards"
              infoTooltipContent={
                <p>
                  Rewards are earned through {lrtDetails?.symbol} token value
                  appreciation. The rewards rate is determined by the price of
                  ETH versus the change of the price of {lrtDetails?.symbol}.
                </p>
              }
            >
              {networkStats.apy}
            </InfoBadge>
          </div>
        }
      >
        <RestakeField
          tab={tab}
          amount={tab === 'Restake' ? restakeInputAmount : withdrawInputAmount}
          activeToken={activeToken}
          disabled={
            tab === 'Restake' ? restakeWrite.isLoading : withdrawWrite.isLoading
          }
          lrtDetails={lrtDetails}
          activeTokenBalance={restakeForm.accountTokenBalance}
          restakingTokenBalance={restakingTokenBalance}
          estimatedMaxGas={restakeForm.gasEstimates?.estimatedTotalCost}
          setRestakingAmount={restakeForm.handleChangeAmount}
          setWithdrawalAmount={handleChangeAmount}
        />
        <div className="flex flex-col items-center w-full md:flex-row">
          <RestakingTokenExchangeRate
            assetSymbol={restakeForm.activeToken?.symbol}
            restakingTokenSymbol={lrtDetails?.symbol}
            rateDenominator={tab === 'Restake' ? 'asset' : 'restakingToken'}
            className="basis-[calc(33%-32px)] mb-2 md:mb-0 md:mr-2 w-full md:w-[unset]"
          />
          <AnimatePresence>
            {tab === 'Withdraw' && (
              <motion.div
                initial={{
                  opacity: 0,
                  zoom: 0.8,
                  flexGrow: 0,
                  flexShrink: 1,
                  flexBasis: 0,
                  ...(isMobile
                    ? {
                        maxHeight: 0,
                        height: 0,
                        marginTop: 0,
                        marginBottom: 0
                      }
                    : {
                        width: 0,
                        marginLeft: 0,
                        marginRight: 0
                      })
                }}
                animate={{
                  opacity: 1,
                  zoom: 1,
                  flexGrow: 1,
                  flexShrink: 0,
                  flexBasis: 'calc(33% - 32px)',
                  ...(isMobile
                    ? {
                        maxHeight: 200,
                        height: 'auto',
                        marginTop: '0.5rem',
                        marginBottom: '0.5rem'
                      }
                    : {
                        width: '100%',
                        marginLeft: '0.5rem',
                        marginRight: '0.5rem'
                      })
                }}
                transition={{ duration: 0.2 }}
                exit={{
                  opacity: 0,
                  zoom: 0.8,
                  flexGrow: 0,
                  flexShrink: 1,
                  flexBasis: 0,
                  ...(isMobile
                    ? {
                        maxHeight: 0,
                        height: 0,
                        marginTop: 0,
                        marginBottom: 0
                      }
                    : {
                        width: 0,
                        marginLeft: 0,
                        marginRight: 0
                      })
                }}
                className="relative origin-[50% 50%] w-full md:w-[unset]"
                style={
                  isMobile
                    ? {
                        maxHeight: 200,
                        height: 'auto',
                        marginTop: '0.5rem',
                        marginBottom: '0.5rem'
                      }
                    : {
                        width: '100%',
                        marginLeft: '0.5rem',
                        marginRight: '0.5rem'
                      }
                }
              >
                <DetailBox
                  title={<span className="leading-none">Withdrawal delay</span>}
                  className="w-full h-full whitespace-nowrap flex-grow flex-shrink-0 basis-full"
                >
                  <span className="leading-none">1-8 days</span>
                </DetailBox>
              </motion.div>
            )}
          </AnimatePresence>
          <DetailBox
            title={
              <span className="leading-none">
                {tab === 'Restake' ? 'Reward fee' : 'Withdrawal fee'}
              </span>
            }
            className="w-full md:w-[unset] basis-[calc(33%-32px)] mt-2 md:mt-0 md:ml-2"
          >
            <span className="leading-none">
              {tab === 'Restake' ? '10%' : 'None'}
            </span>
          </DetailBox>
        </div>
        <DetailBox
          direction="row"
          title={
            <div className="flex items-center gap-2 leading-none">
              <span>
                {tab === 'Restake' ? 'Receive' : 'Estimated to Receive'}
              </span>

              <InfoTooltip align="center" contentClassName="max-w-[300px] p-3">
                {tab === 'Restake' ? (
                  <p>
                    Estimation is based on current market conditions. Actual
                    amounts may change based on market fluctuations, pending
                    rewards, and slashing events.
                  </p>
                ) : (
                  <p>
                    An estimated amount and may change based on market
                    fluctuations, pending rewards and slashing events.
                  </p>
                )}
              </InfoTooltip>
            </div>
          }
        >
          {estimatedWithdrawalAmount}
        </DetailBox>

        <TransactionButton
          {...(tab === 'Restake'
            ? {
                transactionType: RioTransactionType.DEPOSIT,
                toasts: {
                  sent: 'Restake transaction sent',
                  error: 'Failed to restake',
                  success: `Sucessfully restaked ${displayAmount(
                    Number(restakeInputAmount)
                  )} ${restakeForm.activeToken?.symbol ?? ''}`
                },
                refetch: restakeForm.refetchUserBalances,
                hash: restakeWrite.txHash,
                disabled:
                  !restakeForm.isValidAmount ||
                  restakeForm.isEmpty ||
                  restakeWrite.isLoading,
                isSigning: restakeWrite.isLoading,
                error: restakeWrite.error,
                reset: restakeForm.resetForm,
                clearErrors: restakeForm.clearErrors,
                write: restakeWrite.write
              }
            : {
                transactionType: RioTransactionType.WITHDRAW_REQUEST,
                toasts: {
                  sent: `Withdrawal request sent`,
                  success: `Sucessfully requested to unstake ${withdrawInputAmount} ${lrtDetails?.symbol}`,
                  error: `An error occurred  requesting withdrawal`
                },
                hash: withdrawWrite.txHash,
                refetch: withdrawForm.refetch,
                disabled:
                  !address ||
                  !withdrawForm.amount ||
                  !withdrawForm.isValidAmount ||
                  withdrawWrite.isLoading,
                isSigning: withdrawWrite.isLoading,
                error: withdrawWrite.error,
                reset: withdrawForm.resetForm,
                clearErrors: withdrawWrite.reset,
                write: withdrawWrite.write
              })}
        >
          {tab === 'Restake' ? 'Restake' : 'Request withdrawal'}
        </TransactionButton>
        {!restakeForm.isAllowed && address && (
          <ApproveButtons
            allowanceTarget={restakeForm.allowanceTarget}
            accountAddress={address}
            isValidAmount={restakeForm.isValidAmount}
            amount={restakeForm.amount || BigInt(0)}
            token={restakeForm.activeToken}
            refetchAllowance={restakeForm.handleRefetchAllowance}
          />
        )}
        {restakeForm.allowanceNote && (
          <p className="text-sm text-center px-2 mt-2 text-foregroundA8 font-normal">
            {restakeForm.allowanceNote}
          </p>
        )}
      </TabCard>
    </>
  );
}
