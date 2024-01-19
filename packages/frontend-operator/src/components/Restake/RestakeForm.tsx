import React, { useEffect, useMemo, useState } from 'react';
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
import { AssetDetails, LRTDetails } from '@rio-monorepo/ui/lib/typings';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { displayEthAmount } from '@rio-monorepo/ui/lib/utilities';
import HR from '@rio-monorepo/ui/components/Shared/HR';
import DepositButton from './DepositButton';
import {
  LiquidRestakingTokenClient,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { Address, Hash, formatUnits, zeroAddress } from 'viem';
import ApproveButtons from '@rio-monorepo/ui/components/Shared/ApproveButtons';
import Skeleton from 'react-loading-skeleton';

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
  const [isDepositError, setIsDepositError] = useState(false);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isDepositSuccess, setIsDepositSuccess] = useState(false);
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

  const {
    data,
    isError,
    isLoading,
    refetch: refetchBalance
  } = useAssetBalance(activeToken);

  const isValidAmount =
    !!amount && amount > BigInt(0) && amount <= accountTokenBalance;
  const isEmpty = !amount;

  const resetForm = () => {
    setAmount(null);
    setIsDepositSuccess(false);
    setIsDepositError(false);
    setIsDepositLoading(false);
  };

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
      address && allowanceTarget && activeToken && activeToken.symbol !== 'ETH'
        ? true
        : false
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
    isLoading: isTxLoading
  } = useWaitForTransaction({
    hash: depositTxHash,
    enabled: !!depositTxHash
  });

  useEffect(() => {
    if (isTxLoading) {
      setIsDepositLoading(true);
      setIsDepositError(false);
      setIsDepositSuccess(false);
      return;
    }
    if (isTxError) {
      setIsDepositLoading(false);
      setIsDepositError(true);
      setIsDepositSuccess(false);
      return;
    }
    if (txData?.status === 'success') {
      setIsDepositLoading(false);
      setIsDepositError(false);
      setIsDepositSuccess(true);
      setAmount(null);
      return;
    }
    if (txData?.status === 'reverted') {
      setIsDepositLoading(false);
      setIsDepositError(true);
      setIsDepositSuccess(false);
      return;
    }
  }, [txData, isTxLoading, isTxError]);

  const handleJoin = async () => {
    if (!activeToken || !restakingToken) {
      return;
    }

    const depositFunction =
      activeToken.symbol === 'ETH'
        ? restakingToken.depositETH({ amount: minAmountOut })
        : restakingToken.deposit({
            amount: minAmountOut,
            tokenIn: activeToken.address
          });

    await depositFunction
      .then((res) => {
        setIsDepositSuccess(true);
        setIsDepositLoading(false);
        setDepositTxHash(res);
        return res;
      })
      .catch((err) => {
        console.error('err', err);
        setIsDepositError(true);
        setIsDepositLoading(false);
      });
  };

  const handleExecute = () => {
    setIsDepositLoading(true);
    setIsDepositError(false);
    setIsDepositSuccess(false);
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

  useEffect(() => {
    if (!txReceipt) return;
    refetchBalance().catch(console.error);
  }, [txReceipt]);

  return (
    <>
      {isMounted && isLoading && (
        <div className="w-full text-center min-h-[100px] flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {isMounted && isError && (
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
            setAmount={setAmount}
            setActiveToken={setActiveToken}
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
          {isAllowed && address && (
            <DepositButton
              isValidAmount={isValidAmount}
              isEmpty={isEmpty}
              isDepositLoading={isDepositLoading}
              isDepositSuccess={isDepositSuccess}
              isDepositError={isDepositError}
              accountAddress={address}
              depositTxHash={depositTxHash}
              setIsDepositSuccess={setIsDepositSuccess}
              setIsDepositError={setIsDepositError}
              handleExecute={handleExecute}
            />
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