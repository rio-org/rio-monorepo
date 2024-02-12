import {
  Address,
  Hash,
  formatUnits,
  getAddress,
  parseEther,
  parseUnits,
  zeroAddress
} from 'viem';
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Spinner } from '@material-tailwind/react';
import Skeleton from 'react-loading-skeleton';
import {
  type AssetDetails,
  type ContractError,
  type LRTDetails,
  RioTransactionType
} from '@rio-monorepo/ui/lib/typings';
import {
  type LiquidRestakingTokenClient,
  useLiquidRestakingToken,
  RioLRTCoordinatorABI
} from '@rionetwork/sdk-react';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import ApproveButtons from '@rio-monorepo/ui/components/Shared/ApproveButtons';
import { InfoTooltip } from '@rio-monorepo/ui/components/Shared/InfoTooltip';
import HR from '@rio-monorepo/ui/components/Shared/HR';
import StakeField from './StakeField';
import { useAssetExchangeRate } from '@rio-monorepo/ui/hooks/useAssetExchangeRate';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useAssetBalance } from '@rio-monorepo/ui/hooks/useAssetBalance';
import {
  asType,
  displayAmount,
  displayEthAmount
} from '@rio-monorepo/ui/lib/utilities';
import { NATIVE_ETH_ADDRESS } from '@rio-monorepo/ui/config';
import { useContractGasCost } from '@rio-monorepo/ui/hooks/useContractGasCost';
import { useIsTouch } from '@rio-monorepo/ui/contexts/TouchProvider';

const queryTokens = async (
  restakingToken: LiquidRestakingTokenClient | null,
  amount: bigint | null
): Promise<bigint | undefined> => {
  const query = await restakingToken?.getEstimatedOutForETHDeposit({
    amount: amount || BigInt(0)
  });
  return query;
};

export function RestakeForm({ lrtDetails }: { lrtDetails?: LRTDetails }) {
  if (lrtDetails) {
    return <RestakeFormWithLRTWrapper lrtDetails={lrtDetails} />;
  }

  return (
    <RestakeFormBase lrtDetails={lrtDetails} restakingTokenClient={null} />
  );
}

function RestakeFormWithLRTWrapper({ lrtDetails }: { lrtDetails: LRTDetails }) {
  const restakingTokenClient = useLiquidRestakingToken(lrtDetails.address);
  return (
    <RestakeFormBase
      restakingTokenClient={restakingTokenClient}
      lrtDetails={lrtDetails}
    />
  );
}

function RestakeFormBase({
  restakingTokenClient,
  lrtDetails
}: {
  restakingTokenClient: LiquidRestakingTokenClient | null;
  lrtDetails?: LRTDetails;
}) {
  const assets = useMemo(() => {
    return lrtDetails?.underlyingAssets.map((t) => t.asset) || [];
  }, [lrtDetails]);
  const [coordinatorAddress, setCoordinatorAddress] = useState<
    Address | undefined
  >(
    restakingTokenClient?.token?.deployment?.coordinator as Address | undefined
  );

  useEffect(
    function setCoordinatorAddressBecauseLRTDoesNotTriggerRerender() {
      if (coordinatorAddress || !restakingTokenClient) return;
      const timeout = setInterval(
        () =>
          setCoordinatorAddress(
            asType<Address>(
              restakingTokenClient?.token?.deployment?.coordinator
            )
          ),
        500
      );
      return () => clearInterval(timeout);
    },
    [restakingTokenClient, coordinatorAddress]
  );

  const [amount, setAmount] = useState<bigint | null>(null);
  const [accountTokenBalance, setAccountTokenBalance] = useState(BigInt(0));
  const [activeToken, setActiveToken] = useState<AssetDetails>(assets?.[0]);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState<ContractError | null>(null);
  const [depositTxHash, setDepositTxHash] = useState<Hash>();
  const [allowanceTarget, setAllowanceTarget] = useState<Address>();
  const [allowanceNote, setAllowanceNote] = useState<string | null>(null);
  const [minAmountOut, setMinAmountOut] = useState<string | bigint>(BigInt(0));
  const [isAllowed, setIsAllowed] = useState(true);
  const { data: exchangeRate } = useAssetExchangeRate({
    asset: activeToken,
    lrt: lrtDetails
  });
  const { address } = useAccountIfMounted();
  const isTouch = useIsTouch();

  const { refetch: refetchLrtBalance } = useAssetBalance(lrtDetails);

  const {
    data,
    isError,
    isLoading,
    refetch: refetchBalance
  } = useAssetBalance(activeToken);

  const isValidAmount =
    !!amount && amount > BigInt(0) && amount <= accountTokenBalance;
  const isEmpty = !amount;

  const clearErrors = useCallback(() => {
    setDepositError(null);
    setIsDepositLoading(false);
    setDepositTxHash(undefined);
  }, []);

  const resetForm = useCallback(() => {
    setAmount(null);
    clearErrors();
  }, []);

  useEffect(() => {
    if (!data) return;
    setAccountTokenBalance(data.value);
  }, [data]);

  useEffect(() => {
    setAmount(null);
  }, [accountTokenBalance]);

  useEffect(() => {
    !address && resetForm();
    setActiveToken((_activeToken) => _activeToken || assets?.[0]);
  }, [address, assets]);

  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address: activeToken?.address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address || zeroAddress, allowanceTarget || zeroAddress],
    enabled:
      !!address &&
      !!allowanceTarget &&
      getAddress(allowanceTarget) !== NATIVE_ETH_ADDRESS &&
      !!activeToken &&
      activeToken.symbol !== 'ETH'
  });

  const handleRefetchAllowance = () => {
    refetchAllowance().catch((err) => {
      console.log('Error refetching allowance', err);
    });
  };

  useEffect(() => {
    if (!activeToken) return;

    resetForm(); // reset form when switching tokens
    if (!restakingTokenClient || activeToken?.symbol === 'ETH') {
      setAllowanceTarget(undefined);
      return;
    }
    try {
      if (restakingTokenClient?.allowanceTarget) {
        setAllowanceTarget(restakingTokenClient.allowanceTarget as Address);
      }
    } catch (err) {
      console.error('Error getting allowance target', err);
    }
  }, [restakingTokenClient, activeToken]);

  useEffect(() => {
    if (!activeToken) return;

    if (activeToken.symbol === 'ETH') {
      setIsAllowed(true);
      return;
    }
    if (amount && (allowance || BigInt(0)) >= amount) {
      setIsAllowed(true);
      setAllowanceNote(null);
    } else {
      if (isValidAmount && allowance && allowance > BigInt(0)) {
        setAllowanceNote('Increase your allowance to restake this amount');
      }
      setIsAllowed(false);
    }
    if (!amount) {
      setIsAllowed((allowance || BigInt(0)) > BigInt(0));
      setAllowanceNote(null);
    }
  }, [allowance, amount]);

  useEffect(() => {
    if (restakingTokenClient) {
      queryTokens(restakingTokenClient, amount)
        .then(handleTokenQuery)
        .catch(console.error);
    }
  }, [amount, activeToken]);

  const handleTokenQuery = (estimatedOut?: bigint) => {
    if (typeof estimatedOut === 'undefined') return;
    setMinAmountOut(estimatedOut);
  };

  const {
    data: txData,
    isError: isTxError,
    isLoading: isTxLoading,
    error: txError
  } = useWaitForTransaction({
    hash: depositTxHash,
    enabled: !!depositTxHash
  });

  useEffect(() => {
    if (isTxLoading) {
      setIsDepositLoading(true);
      setDepositError(null);
      return;
    }
    if (isTxError || txError) {
      setIsDepositLoading(false);
      setDepositError(txError);
      return;
    }
    if (txData?.status === 'success') {
      setIsDepositLoading(false);
      setDepositError(null);
      setAmount(null);
      return;
    }
    if (txData?.status === 'reverted') {
      setIsDepositLoading(false);
      setDepositError(txError || null);
      return;
    }
  }, [txData, isTxLoading, isTxError, txError]);

  const isEth = activeToken?.symbol === 'ETH';

  const contractWriteConfig = useMemo(
    () =>
      ({
        address: coordinatorAddress || zeroAddress,
        abi: RioLRTCoordinatorABI,
        functionName: isEth ? 'depositETH' : 'deposit',
        args: isEth
          ? undefined
          : ([activeToken?.address || zeroAddress, amount || 0n] as const),
        value: isEth ? amount || 0n : undefined,
        enabled: !!coordinatorAddress && !!activeToken?.address && !!address
      }) as const,
    [coordinatorAddress, isEth, activeToken?.address, amount, address]
  );

  const gasEstimateArgAmount = isEth
    ? parseEther(data?.formatted ?? '0')
    : parseUnits(data?.formatted ?? '0', activeToken?.decimals);

  const { data: gasEstimates, isLoading: isGasLoading } = useContractGasCost({
    ...contractWriteConfig,
    args: isEth
      ? undefined
      : ([activeToken?.address || zeroAddress, gasEstimateArgAmount] as const),
    value: isEth ? gasEstimateArgAmount : undefined
  });

  const gas = useMemo(() => {
    const _gas = { ...gasEstimates };
    delete _gas.estimatedTotalCost;
    return _gas;
  }, [gasEstimates]);

  const { config, error: prepareWriteError } = usePrepareContractWrite({
    ...contractWriteConfig,
    ...gas,
    enabled:
      !!contractWriteConfig.enabled &&
      !!gasEstimates &&
      !isGasLoading &&
      !!amount
  });

  const {
    data: writeData,
    write,
    error: writeError,
    reset: resetWrite
  } = useContractWrite(config);

  useEffect(
    function storeHash() {
      if (!writeData?.hash) return;
      setDepositTxHash(writeData.hash);
    },
    [writeData?.hash]
  );

  const executionError = writeError || prepareWriteError;
  useEffect(
    function storeTxError() {
      if (!executionError) return;
      setDepositError(executionError);
      setIsDepositLoading(false);
    },
    [executionError]
  );

  const handleExecute = () => {
    if (!activeToken || isDepositLoading || !amount || !write) {
      return;
    }
    setIsDepositLoading(true);
    setDepositError(null);
    setDepositTxHash(undefined);
    write?.();
  };

  const { data: txReceipt } = useWaitForTransaction({
    hash: depositTxHash,
    confirmations: 1,
    enabled: !!depositTxHash
  });

  const refetchUserBalances = useCallback(() => {
    refetchLrtBalance().catch(console.error);
    refetchBalance().catch(console.error);
  }, [refetchLrtBalance, refetchBalance]);

  useEffect(() => {
    if (!txReceipt) return;
    refetchUserBalances();
  }, [txReceipt]);

  const handleChangeAmount = useCallback(
    (amount: bigint | null) => {
      if (depositTxHash || depositError) {
        clearErrors();
        resetWrite();
      }
      setAmount(amount);
    },
    [clearErrors, depositTxHash, depositError, resetWrite]
  );

  const handleChangeActiveToken = useCallback(
    (activeToken: AssetDetails) => {
      if (depositTxHash || depositError) {
        clearErrors();
        resetWrite();
      }
      setActiveToken(activeToken);
    },
    [clearErrors, depositTxHash, depositError, resetWrite]
  );

  const exchangeRateDecimals = isTouch ? [2, 2] : [3, 3];

  return (
    <>
      {isLoading && (
        <div className="w-full text-center min-h-[100px] flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {!!address && isError && (
        <Alert color="red">Error loading account balance.</Alert>
      )}
      {!isLoading && (
        <>
          <StakeField
            amount={amount}
            activeToken={activeToken}
            accountTokenBalance={accountTokenBalance}
            isDisabled={isDepositLoading}
            assets={assets}
            lrt={lrtDetails}
            estimatedMaxGas={gasEstimates?.estimatedTotalCost}
            setAmount={handleChangeAmount}
            setActiveToken={handleChangeActiveToken}
          />
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-between">
              <span className="flex items-center text-black gap-1">
                <span className="opacity-50 text-[14px]">Exchange rate</span>

                <InfoTooltip
                  align="center"
                  contentClassName="max-w-[300px] space-y-1 p-3"
                >
                  <p>
                    The amount of {lrtDetails?.symbol} you will receive for each{' '}
                    {activeToken?.symbol} deposited.
                  </p>
                  <p className="opacity-75 text-xs">
                    The exchange rate increases ({lrtDetails?.symbol} is worth
                    more than {activeToken?.symbol}) as restaking rewards are
                    earned and may decrease if there is a slashing event.
                  </p>
                </InfoTooltip>
              </span>
              {!exchangeRate ? (
                <Skeleton height="0.875rem" width={80} />
              ) : (
                <span className="flex items-center gap-1">
                  <strong className="text-right text-[14px]">
                    {displayAmount(1, ...exchangeRateDecimals)}{' '}
                    {activeToken?.symbol} ={' '}
                    {displayAmount(+exchangeRate.lrt, ...exchangeRateDecimals)}{' '}
                    {lrtDetails?.symbol}{' '}
                    <strong className="opacity-50">
                      (${exchangeRate.formatted.usd})
                    </strong>
                  </strong>
                  {+exchangeRate.formatted.lrt !== exchangeRate.lrt && (
                    <InfoTooltip>
                      <p>
                        <span className="font-semibold block">
                          Exact exchange rate
                        </span>
                        <span className="block">
                          {exchangeRate.lrt} {lrtDetails?.symbol}
                        </span>
                      </p>
                    </InfoTooltip>
                  )}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="flex items-center text-black gap-1">
                <span className="opacity-50 text-[14px]">Reward fee</span>

                <InfoTooltip
                  align="center"
                  contentClassName="max-w-[300px] p-3"
                >
                  <p>
                    The percentage taken from all staking rewards (not
                    deposits).
                  </p>
                </InfoTooltip>
              </span>
              <strong className="text-right text-[14px]">10%</strong>
            </div>
          </div>
          <HR />
          <div className="flex justify-between">
            <span className="flex items-center text-black gap-1">
              <span className="font-bold text-[14px]">Received</span>

              <InfoTooltip align="center" contentClassName="max-w-[300px] p-3">
                <p>
                  The amount of reETH received is an estimate. The actual amount
                  of reETH may vary slightly due to fluctuations in the price of
                  ETH and cost of gas.
                </p>
              </InfoTooltip>
            </span>
            <strong className="text-[14px]">
              {minAmountOut && typeof minAmountOut === 'bigint'
                ? displayEthAmount(
                    formatUnits(minAmountOut, activeToken.decimals)
                  )
                : displayAmount(0)}{' '}
              {lrtDetails?.symbol}
            </strong>
          </div>
          {isAllowed && (
            <>
              <TransactionButton
                transactionType={RioTransactionType.DEPOSIT}
                refetch={refetchUserBalances}
                hash={depositTxHash}
                disabled={!isValidAmount || isEmpty || isDepositLoading}
                isSigning={isDepositLoading}
                error={depositError}
                reset={resetForm}
                clearErrors={clearErrors}
                write={handleExecute}
              >
                {isEmpty
                  ? 'Enter an amount'
                  : !isValidAmount
                  ? 'Insufficient balance'
                  : 'Restake'}
              </TransactionButton>
            </>
          )}
          {!isAllowed && address && (
            <ApproveButtons
              allowanceTarget={allowanceTarget}
              accountAddress={address}
              isValidAmount={isValidAmount}
              amount={amount || BigInt(0)}
              token={activeToken}
              refetchAllowance={handleRefetchAllowance}
            />
          )}
          {allowanceNote && (
            <p className="text-sm text-center px-2 mt-2 text-gray-500 font-normal">
              {allowanceNote}
            </p>
          )}
        </>
      )}
    </>
  );
}
