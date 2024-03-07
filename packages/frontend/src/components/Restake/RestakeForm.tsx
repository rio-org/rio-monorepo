import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from '@material-tailwind/react';
import {
  type Address,
  type Hash,
  erc20Abi,
  formatUnits,
  getAddress,
  parseEther,
  parseUnits,
  zeroAddress
} from 'viem';
import {
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';
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
import { RestakingTokenExchangeRate } from '@rio-monorepo/ui/components/Shared/RestakingTokenExchangeRate';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import ApproveButtons from '@rio-monorepo/ui/components/Shared/ApproveButtons';
import { InfoTooltip } from '@rio-monorepo/ui/components/Shared/InfoTooltip';
import HR from '@rio-monorepo/ui/components/Shared/HR';
import StakeField from './StakeField';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useAssetBalance } from '@rio-monorepo/ui/hooks/useAssetBalance';
import {
  asType,
  displayAmount,
  displayEthAmount
} from '@rio-monorepo/ui/lib/utilities';
import { NATIVE_ETH_ADDRESS } from '@rio-monorepo/ui/config';
import { useContractGasCost } from '@rio-monorepo/ui/hooks/useContractGasCost';

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

  const [inputAmount, setInputAmount] = useState<string>('');
  const [accountTokenBalance, setAccountTokenBalance] = useState(BigInt(0));
  const [activeToken, setActiveToken] = useState<AssetDetails>(assets?.[0]);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState<ContractError | null>(null);
  const [depositTxHash, setDepositTxHash] = useState<Hash>();
  const [allowanceTarget, setAllowanceTarget] = useState<Address>();
  const [allowanceNote, setAllowanceNote] = useState<string | null>(null);
  const [minAmountOut, setMinAmountOut] = useState<string | bigint>(BigInt(0));
  const [isAllowed, setIsAllowed] = useState(true);
  const { address } = useAccountIfMounted();

  const amount = inputAmount
    ? parseUnits(inputAmount, activeToken?.decimals || 18)
    : null;

  const { refetch: refetchLrtBalance } = useAssetBalance(lrtDetails);

  const {
    data,
    isError,
    refetch: refetchBalance
  } = useAssetBalance(activeToken);

  const isEth = activeToken?.symbol === 'ETH';

  type WriteConfig<T extends 'depositETH' | 'deposit'> = T extends 'depositETH'
    ? {
        address: Address;
        abi: typeof RioLRTCoordinatorABI;
        functionName: 'depositETH';
        args: undefined;
        value: bigint;
        enabled: boolean;
      }
    : {
        address: Address;
        abi: typeof RioLRTCoordinatorABI;
        functionName: 'deposit';
        args: [Address, bigint];
        value: undefined;
        enabled: boolean;
      };

  const functionName = isEth ? 'depositETH' : 'deposit';

  const contractWriteConfig = useMemo<WriteConfig<typeof functionName>>(
    () =>
      ({
        address: coordinatorAddress || zeroAddress,
        abi: RioLRTCoordinatorABI,
        functionName,
        args: isEth
          ? undefined
          : ([activeToken?.address || zeroAddress, amount || 0n] as const),
        value: isEth ? amount || 0n : undefined,
        enabled: !!coordinatorAddress && !!activeToken?.address
      }) as WriteConfig<typeof functionName>,
    [
      coordinatorAddress,
      isEth,
      activeToken?.address,
      amount,
      address,
      functionName
    ]
  );

  const gasEstimateArgAmount = isEth
    ? parseEther(data?.formatted ?? '0')
    : parseUnits(data?.formatted ?? '0', activeToken?.decimals);

  const { data: gasEstimates, isLoading: isGasLoading } = useContractGasCost({
    ...contractWriteConfig,

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    args: isEth
      ? undefined
      : ([activeToken?.address || zeroAddress, gasEstimateArgAmount] as const),

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    value: isEth ? gasEstimateArgAmount : undefined
  });

  const gas = useMemo(() => {
    const _gas = { ...gasEstimates };
    delete _gas.estimatedTotalCost;
    return _gas;
  }, [gasEstimates]);

  const isValidAmount =
    !!amount &&
    amount >= parseUnits('0.01', activeToken.decimals) &&
    amount <= accountTokenBalance &&
    !!gasEstimates &&
    !!activeToken &&
    (activeToken.symbol !== 'ETH' ||
      amount <= accountTokenBalance - gasEstimates.estimatedTotalCost);
  const isEmpty = !amount;

  const clearErrors = useCallback(() => {
    setDepositError(null);
    setIsDepositLoading(false);
    setDepositTxHash(undefined);
  }, []);

  const resetForm = useCallback(() => {
    setInputAmount('');
    clearErrors();
  }, []);

  useEffect(() => {
    if (!data) return;
    setAccountTokenBalance(data.value);
  }, [data]);

  useEffect(() => {
    setInputAmount('');
  }, [accountTokenBalance]);

  useEffect(() => {
    !address && resetForm();
    setActiveToken((_activeToken) => _activeToken || assets?.[0]);
  }, [address, assets]);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: activeToken?.address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address || zeroAddress, allowanceTarget || zeroAddress],
    query: {
      enabled:
        !!address &&
        !!allowanceTarget &&
        getAddress(allowanceTarget) !== NATIVE_ETH_ADDRESS &&
        !!activeToken &&
        activeToken.symbol !== 'ETH'
    }
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
  } = useWaitForTransactionReceipt({
    hash: depositTxHash,
    query: { enabled: !!depositTxHash }
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
      setInputAmount('');
      return;
    }
    if (txData?.status === 'reverted') {
      setIsDepositLoading(false);
      setDepositError(txError || null);
      return;
    }
  }, [txData, isTxLoading, isTxError, txError]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data: writeData, error: prepareWriteError } = useSimulateContract({
    ...contractWriteConfig,
    ...gas,
    query: {
      enabled:
        !!coordinatorAddress &&
        !!activeToken?.address &&
        !!address &&
        isValidAmount &&
        !!contractWriteConfig.enabled &&
        !!gasEstimates &&
        !isGasLoading &&
        !!amount
    }
  });

  const {
    data: hash,
    writeContract,
    error: writeError,
    reset: resetWrite
  } = useWriteContract();

  useEffect(
    function storeHash() {
      if (!hash) return;
      setDepositTxHash(hash);
    },
    [hash]
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
    if (
      !activeToken ||
      isDepositLoading ||
      !amount ||
      !writeContract ||
      !writeData?.request
    ) {
      return;
    }
    setIsDepositLoading(true);
    setDepositError(null);
    setDepositTxHash(undefined);
    writeContract?.(writeData?.request);
  };

  const { data: txReceipt } = useWaitForTransactionReceipt({
    hash: depositTxHash,
    confirmations: 1,
    query: { enabled: !!depositTxHash }
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
    (amount: string | null) => {
      if (depositTxHash || depositError) {
        clearErrors();
        resetWrite();
      }
      setInputAmount(amount || '');
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

  return (
    <>
      {!!address && isError && (
        <Alert color="red">Error loading account balance.</Alert>
      )}
      <StakeField
        amount={inputAmount}
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
          <span className="flex items-center text-foreground gap-1">
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
                The exchange rate increases ({lrtDetails?.symbol} is worth more
                than {activeToken?.symbol}) as restaking rewards are earned and
                may decrease if there is a slashing event.
              </p>
            </InfoTooltip>
          </span>
          <RestakingTokenExchangeRate
            assetSymbol={activeToken?.symbol}
            restakingTokenSymbol={lrtDetails?.symbol}
            defaultRateDenominator="asset"
          />
        </div>
        <div className="flex justify-between">
          <span className="flex items-center text-foreground gap-1">
            <span className="opacity-50 text-[14px]">Reward fee</span>

            <InfoTooltip align="center" contentClassName="max-w-[300px] p-3">
              <p>
                The percentage taken from all staking and restaking rewards (not
                withdrawals or deposits).
              </p>
            </InfoTooltip>
          </span>
          <strong className="text-right text-[14px]">10%</strong>
        </div>
      </div>
      <HR />
      <div className="flex justify-between">
        <span className="flex items-center text-foreground gap-1">
          <span className="font-bold text-[14px]">Received</span>

          <InfoTooltip align="center" contentClassName="max-w-[300px] p-3">
            <p>
              Estimation is based on current market conditions. Actual amounts
              may change based on market fluctuations, pending rewards, and
              slashing events.
            </p>
          </InfoTooltip>
        </span>
        <strong className="text-[14px]">
          {minAmountOut && typeof minAmountOut === 'bigint'
            ? displayEthAmount(formatUnits(minAmountOut, activeToken.decimals))
            : displayAmount(0)}{' '}
          {lrtDetails?.symbol}
        </strong>
      </div>
      {isAllowed && (
        <>
          <TransactionButton
            transactionType={RioTransactionType.DEPOSIT}
            toasts={{
              sent: 'Restake transaction sent',
              error: 'Failed to restake',
              success: `Sucessfully restaked ${displayAmount(
                Number(inputAmount)
              )} ${activeToken?.symbol ?? ''}`
            }}
            refetch={refetchUserBalances}
            hash={depositTxHash}
            disabled={!isValidAmount || isEmpty || isDepositLoading}
            isSigning={isDepositLoading}
            error={depositError}
            reset={resetForm}
            clearErrors={clearErrors}
            write={handleExecute}
          >
            Restake
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
        <p className="text-sm text-center px-2 mt-2 text-foregroundA8 font-normal">
          {allowanceNote}
        </p>
      )}
    </>
  );
}
