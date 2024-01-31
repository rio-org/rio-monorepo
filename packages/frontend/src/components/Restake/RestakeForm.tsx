import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StakeField from './StakeField';
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useWaitForTransaction
} from 'wagmi';
import { Alert, Spinner } from '@material-tailwind/react';
import { useAssetExchangeRate } from '@rio-monorepo/ui/hooks/useAssetExchangeRate';
import { useAssetBalance } from '@rio-monorepo/ui/hooks/useAssetBalance';
import {
  AssetDetails,
  ContractError,
  LRTDetails,
  RioTransactionType
} from '@rio-monorepo/ui/lib/typings';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { displayEthAmount } from '@rio-monorepo/ui/lib/utilities';
import HR from '@rio-monorepo/ui/components/Shared/HR';
import {
  LiquidRestakingTokenClient,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { Address, Hash, formatUnits, getAddress, zeroAddress } from 'viem';
import ApproveButtons from '@rio-monorepo/ui/components/Shared/ApproveButtons';
import Skeleton from 'react-loading-skeleton';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import { NATIVE_ETH_ADDRESS } from '@rio-monorepo/ui/config';

const queryTokens = async (
  restakingToken: LiquidRestakingTokenClient | null,
  amount: bigint | null
): Promise<bigint | undefined> => {
  const query = await restakingToken?.getEstimatedOutForETHDeposit({
    amount: amount || BigInt(0)
  });
  return query;
};

const RestakeForm = ({ lrt }: { lrt?: LRTDetails }) => {
  const assets = useMemo(() => {
    return lrt?.underlyingAssets.map((t) => t.asset) || [];
  }, [lrt]);

  const isMounted = useIsMounted();
  const [amount, setAmount] = useState<bigint | null>(null);
  const [accountTokenBalance, setAccountTokenBalance] = useState(BigInt(0));
  const [activeToken, setActiveToken] = useState<AssetDetails>(assets?.[0]);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState<ContractError | null>(null);
  const [depositTxHash, setDepositTxHash] = useState<Hash>();
  const [allowanceTarget, setAllowanceTarget] = useState<Address>();
  const [allowanceNote, setAllowanceNote] = useState<string | null>(null);
  const [minAmountOut, setMinAmountOut] = useState<string | bigint>(BigInt(0));
  const [isAllowed, setIsAllowed] = useState(false);
  const restakingToken = useLiquidRestakingToken(lrt?.address || '');
  const { data: exchangeRate } = useAssetExchangeRate({
    asset: activeToken,
    lrt
  });
  const { address } = useAccount();

  const { refetch: refetchLrtBalance } = useAssetBalance(lrt);

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
    if (!restakingToken || activeToken?.symbol === 'ETH') {
      setAllowanceTarget(undefined);
      return;
    }
    try {
      if (restakingToken?.allowanceTarget) {
        setAllowanceTarget(restakingToken.allowanceTarget as Address);
      }
    } catch (err) {
      console.error('Error getting allowance target', err);
    }
  }, [restakingToken, activeToken]);

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
    if (restakingToken) {
      queryTokens(restakingToken, amount)
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

  const handleJoin = async () => {
    if (!activeToken || !restakingToken || isDepositLoading || !amount) {
      return;
    }

    const depositFunction =
      activeToken.symbol === 'ETH'
        ? restakingToken.depositETH({ amount })
        : restakingToken.deposit({
            amount,
            tokenIn: activeToken.address
          });

    await depositFunction
      .then((res) => {
        setIsDepositLoading(true);
        setDepositTxHash(res);
        return res;
      })
      .catch((err) => {
        console.error('err', err);
        setDepositError(err);
        setIsDepositLoading(false);
      });
  };

  const handleExecute = () => {
    setIsDepositLoading(true);
    setDepositError(null);
    setDepositTxHash(undefined);
    handleJoin().catch((e) => {
      console.error(e);
    });
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
      if (depositTxHash || depositError) clearErrors();
      setAmount(amount);
    },
    [clearErrors, depositTxHash, depositError]
  );

  const handleChangeActiveToken = useCallback(
    (activeToken: AssetDetails) => {
      if (depositTxHash || depositError) clearErrors();
      setActiveToken(activeToken);
    },
    [clearErrors, depositTxHash, depositError]
  );

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
      {isMounted && !isLoading && (
        <>
          <StakeField
            amount={amount}
            activeToken={activeToken}
            accountTokenBalance={accountTokenBalance}
            isDisabled={isDepositLoading}
            assets={assets}
            lrt={lrt}
            setAmount={handleChangeAmount}
            setActiveToken={handleChangeActiveToken}
          />
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-between text-[14px]">
              <span className="text-black opacity-50">Exchange rate</span>
              {!exchangeRate ? (
                <Skeleton height="0.875rem" width={80} />
              ) : (
                <strong className="text-right">
                  1.00 {activeToken?.symbol} ={' '}
                  {exchangeRate.lrt.toLocaleString()} {lrt?.symbol}{' '}
                  <strong className="opacity-50">
                    (${exchangeRate.usd.toLocaleString()})
                  </strong>
                </strong>
              )}
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-black opacity-50">Reward fee</span>
              <strong className="text-right">10%</strong>
            </div>
          </div>
          <HR />
          <div className="flex justify-between text-[14px]">
            <span className="text-black font-bold">Minimum received</span>
            <strong>
              {minAmountOut && typeof minAmountOut === 'bigint'
                ? displayEthAmount(
                    formatUnits(minAmountOut, activeToken.decimals)
                  )
                : displayEthAmount((0).toString())}{' '}
              reETH
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
};

export default RestakeForm;
