import { NATIVE_ETH_ADDRESS } from '@rio-monorepo/ui/config';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useAssetBalance } from '@rio-monorepo/ui/hooks/useAssetBalance';
import { useContractGasCost } from '@rio-monorepo/ui/hooks/useContractGasCost';
import {
  AssetDetails,
  ContractError,
  LRTDetails
} from '@rio-monorepo/ui/lib/typings';
import { asType } from '@rio-monorepo/ui/lib/utilities';
import {
  LiquidRestakingTokenClient,
  RioLRTCoordinatorABI
} from '@rionetwork/sdk-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Address,
  Hash,
  erc20Abi,
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

export const useRestakeForm = ({
  lrtDetails,
  restakingTokenClient,
  inputAmount,
  setInputAmount,
  assets,
  activeToken,
  setActiveToken
}: {
  lrtDetails?: LRTDetails;
  restakingTokenClient: LiquidRestakingTokenClient | null;
  inputAmount: string;
  setInputAmount: (amount: string) => void;
  assets: AssetDetails[];
  activeToken?: AssetDetails;
  setActiveToken: React.Dispatch<React.SetStateAction<AssetDetails>>;
}) => {
  const [accountTokenBalance, setAccountTokenBalance] = useState(BigInt(0));
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState<ContractError | null>(null);
  const [depositTxHash, setDepositTxHash] = useState<Hash>();
  const [allowanceTarget, setAllowanceTarget] = useState<Address>();
  const [allowanceNote, setAllowanceNote] = useState<string | null>(null);
  const [minAmountOut, setMinAmountOut] = useState<string | bigint>(BigInt(0));
  const [isAllowed, setIsAllowed] = useState(true);
  const { address } = useAccountIfMounted();
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
    : parseUnits(data?.formatted ?? '0', activeToken?.decimals ?? 18);

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
    amount >= parseUnits('0.01', activeToken?.decimals ?? 18) &&
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

  const contractWrite = useMemo(
    () => ({
      txHash: hash,
      isLoading: isDepositLoading,
      error: depositError,
      write: handleExecute,
      reset: resetWrite
    }),
    [hash, isDepositLoading, depositError, handleExecute, resetWrite]
  );

  return {
    amount,
    allowanceTarget,
    activeToken,
    accountTokenBalance,
    gasEstimates,
    handleChangeAmount,
    handleChangeActiveToken,
    isEmpty,
    isError,
    handleRefetchAllowance,
    refetchUserBalances,
    clearErrors,
    resetForm,
    allowanceNote,
    minAmountOut,
    isAllowed,
    isValidAmount,
    contractWrite
  };
};

const queryTokens = async (
  restakingToken: LiquidRestakingTokenClient | null,
  amount: bigint | null
): Promise<bigint | undefined> => {
  const query = await restakingToken?.getEstimatedOutForETHDeposit({
    amount: amount || BigInt(0)
  });
  return query;
};
