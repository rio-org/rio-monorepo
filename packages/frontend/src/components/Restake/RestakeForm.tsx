import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import Skeleton from 'react-loading-skeleton';
import { formatUnits } from 'viem';
import {
  type LRTDetails,
  RioTransactionType,
  AssetDetails,
  RestakeFormTab
} from '@rio-monorepo/ui/lib/typings';
import {
  type LiquidRestakingTokenClient,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { RestakingTokenExchangeRate } from '@rio-monorepo/ui/components/Shared/RestakingTokenExchangeRate';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import ApproveButtons from '@rio-monorepo/ui/components/Shared/ApproveButtons';
import { InfoTooltip } from '@rio-monorepo/ui/components/Shared/InfoTooltip';
import { InfoBadge } from '@rio-monorepo/ui/components/Shared/InfoBadge';
import { IconMedal } from '@rio-monorepo/ui/components/Icons/IconMedal';
import { IconChart } from '@rio-monorepo/ui/components/Icons/IconChart';
import { DetailBox } from '@rio-monorepo/ui/components/Shared/DetailBox';
import { TabCard } from '@rio-monorepo/ui/components/Shared/TabCard';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import {
  displayAmount,
  displayEthAmount
} from '@rio-monorepo/ui/lib/utilities';
import { useRestakeForm } from '../../hooks/useRestakeForm';
import { useWithdrawForm } from '../../hooks/useWithdrawForm';
import { RestakeTokenTitleBar } from '../Lazy/RestakeTokenTitleBar.lazy';
import { RestakeField } from '../Lazy/RestakeField.lazy';
import { MOBILE_MQ } from '@rio-monorepo/ui/lib/constants';
import { twJoin } from 'tailwind-merge';

export interface RestakeFormProps {
  lrtDetails?: LRTDetails;
  tab?: RestakeFormTab;
  onChangeTab?: (tab: RestakeFormTab) => void;
  onWithdrawSuccess?: () => void;
  networkStats: { tvl: string | null; apy: string | null };
}

export function RestakeForm({ lrtDetails, ...props }: RestakeFormProps) {
  if (lrtDetails) {
    return <RestakeFormWithLRTWrapper lrtDetails={lrtDetails} {...props} />;
  }

  return <RestakeFormBase restakingTokenClient={null} {...props} />;
}

function RestakeFormWithLRTWrapper(
  props: Omit<RestakeFormProps, 'lrtDetails'> & { lrtDetails: LRTDetails }
) {
  const restakingTokenClient = useLiquidRestakingToken(
    props.lrtDetails.address
  );
  return (
    <RestakeFormBase {...props} restakingTokenClient={restakingTokenClient} />
  );
}

function RestakeFormBase({
  restakingTokenClient,
  lrtDetails,
  networkStats,
  onWithdrawSuccess,
  tab: tabProp,
  onChangeTab
}: RestakeFormProps & {
  restakingTokenClient: LiquidRestakingTokenClient | null;
}) {
  const { address } = useAccountIfMounted();
  const [restakeInputAmount, setRestakeInputAmount] = useState<string>('');
  const [withdrawInputAmount, setWithdrawInputAmount] = useState<string>('');
  const [tab, setTab] = useState<RestakeFormTab>(
    tabProp || RestakeFormTab.RESTAKE
  );
  const assets = useMemo(() => {
    return lrtDetails?.underlyingAssets.map((t) => t.asset) || [];
  }, [lrtDetails]);
  const [activeToken, setActiveToken] = useState<AssetDetails>(assets?.[0]);

  const isMobile = useMediaQuery({ query: MOBILE_MQ });

  useEffect(() => {
    if (tabProp) setTab(tabProp);
  }, [tabProp]);

  const isRestakeTab = tab === RestakeFormTab.RESTAKE;

  const handleChangeTab = useCallback(
    (newTab: string) => (onChangeTab || setTab)(newTab as RestakeFormTab),
    [onChangeTab]
  );

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
        {tab === RestakeFormTab.RESTAKE ? (
          <>
            {typeof restakeForm.minAmountOut !== 'bigint' ? (
              <Skeleton width={120} />
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
              <Skeleton width={120} />
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
          {(tab === RestakeFormTab.RESTAKE
            ? lrtDetails?.symbol
            : activeToken?.symbol) || <Skeleton className="w-6 h-3.5" />}
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
      <RestakeTokenTitleBar
        lrtDetails={lrtDetails}
        restakingTokenClient={restakingTokenClient}
      />

      <TabCard
        tabs={['Restake', 'Withdraw']}
        defaultValue={tab}
        onValueChange={handleChangeTab}
        cardProps={{ className: 'p-4' }}
        tabDetails={
          <div className="flex justify-between items-center w-full md:justify-start md:w-[unset] gap-6">
            <InfoBadge
              icon={
                <IconMedal strokeWidth={1} className="-translate-y-[1px]" />
              }
              title="TVL"
              infoTooltipContent={
                <p
                  className={twJoin(
                    '[&>span]:text-foreground [&>span]:text-opacity-100',
                    'text-foreground text-opacity-75'
                  )}
                >
                  The <span>Total Value Locked (TVL)</span> represents the total
                  amount of assets underlying the reETH token.
                </p>
              }
            >
              {networkStats.tvl}
            </InfoBadge>
            <InfoBadge
              icon={<IconChart className="-translate-y-[1px]" />}
              title="APR"
              infoTooltipContent={
                <p
                  className={twJoin(
                    '[&>span]:text-foreground [&>span]:text-opacity-100',
                    'text-foreground text-opacity-75'
                  )}
                >
                  Rewards are earned through <span>{lrtDetails?.symbol}</span>{' '}
                  token value appreciation. The rewards rate is determined by
                  the price of <span>ETH</span> versus the change of the price
                  of <span>{lrtDetails?.symbol}</span> over the past 14 days.
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
          amount={isRestakeTab ? restakeInputAmount : withdrawInputAmount}
          activeToken={activeToken}
          disabled={
            isRestakeTab ? restakeWrite.isLoading : withdrawWrite.isLoading
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
            rateDenominator={isRestakeTab ? 'asset' : 'restakingToken'}
            className="basis-[calc(33%-32px)] mb-2 md:mb-0 md:mr-2 w-full md:w-[unset]"
          />
          <AnimatePresence>
            {!isRestakeTab && (
              <AppearingDetailBox isMobile={isMobile}>
                <DetailBox
                  title={
                    <div className="flex items-center gap-1">
                      <span className="leading-none">Withdrawal delay</span>
                      <InfoTooltip
                        align="center"
                        contentClassName="max-w-[300px] p-3"
                      >
                        <p className="font-normal block whitespace-break-spaces max-w-full">
                          The waiting period for your funds to be claimable
                          after making a withdrawal request.
                        </p>
                      </InfoTooltip>
                    </div>
                  }
                  className="w-full h-full whitespace-nowrap flex-grow flex-shrink-0 basis-full"
                >
                  <span className="leading-none">1-8 days</span>
                </DetailBox>
              </AppearingDetailBox>
            )}
          </AnimatePresence>
          <DetailBox
            title={
              <div className="flex items-center gap-1 leading-none">
                <span className="leading-none">
                  {isRestakeTab ? 'Reward fee' : 'Withdrawal fee'}
                </span>

                <InfoTooltip
                  align="center"
                  contentClassName="max-w-[300px] p-3 font-normal"
                >
                  {isRestakeTab ? (
                    <p>
                      The percentage taken from all staking and restaking
                      rewards (not withdrawals or deposits).
                    </p>
                  ) : (
                    <p>
                      Fees applied when funds are withdrawn from the Rio
                      Network.
                    </p>
                  )}
                </InfoTooltip>
              </div>
            }
            className="w-full md:w-[unset] basis-[calc(33%-32px)] mt-2 md:mt-0 md:ml-2"
          >
            <span className="leading-none">
              {isRestakeTab ? '10%' : 'None'}
            </span>
          </DetailBox>
        </div>
        <DetailBox
          direction="row"
          title={
            <div className="flex items-center gap-2 leading-none">
              <span>{isRestakeTab ? 'Receive' : 'Estimated to Receive'}</span>

              <InfoTooltip align="center" contentClassName="max-w-[300px] p-3">
                {isRestakeTab ? (
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
          {...(isRestakeTab
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
                  error: `An error occurred requesting withdrawal`
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
          {isRestakeTab ? 'Restake' : 'Request withdrawal'}
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

function detailBoxStyle(isMobile: boolean, hidden?: boolean) {
  return {
    opacity: hidden ? 0 : 1,
    zoom: hidden ? 0.8 : 1,
    flexGrow: hidden ? 0 : 1,
    flexShrink: hidden ? 1 : 0,
    flexBasis: hidden ? 0 : 'calc(33% - 32px)',
    ...(isMobile
      ? {
          maxHeight: hidden ? 0 : 200,
          height: hidden ? 0 : 'auto',
          marginTop: hidden ? 0 : '0.5rem',
          marginBottom: hidden ? 0 : '0.5rem'
        }
      : {
          width: hidden ? 0 : '100%',
          marginLeft: hidden ? 0 : '0.5rem',
          marginRight: hidden ? 0 : '0.5rem'
        })
  };
}

function AppearingDetailBox({
  children,
  isMobile
}: {
  isMobile: boolean;
  children: React.ReactNode;
}) {
  const hidden = useMemo(() => detailBoxStyle(isMobile, true), [isMobile]);
  const visible = useMemo(() => detailBoxStyle(isMobile), [isMobile]);
  return (
    <motion.div
      initial={hidden}
      animate={visible}
      exit={hidden}
      transition={{ duration: 0.2 }}
      className="relative origin-[50% 50%] w-full md:w-[unset]"
      style={visible}
    >
      {children}
    </motion.div>
  );
}
