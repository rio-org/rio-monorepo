import { Alert, Spinner } from '@material-tailwind/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useAccount, useWaitForTransaction } from 'wagmi';
import { AssetDetails, LRTDetails } from '@rio-monorepo/ui/lib/typings';
import WithdrawAssetSelector from './WithdrawAssetSelector';
import WithdrawButton from './WithdrawButton';
import WithdrawField from './WithdrawField';
import WithdrawItemized from './WithdrawItemized';
import {
  useLiquidRestakingToken,
  LiquidRestakingTokenClient
} from '@rionetwork/sdk-react';
import { Hash } from 'viem';
import { useAssetBalance } from '@rio-monorepo/ui/hooks/useAssetBalance';

const WithdrawForm = ({ lrt }: { lrt?: LRTDetails }) => {
  const assets = useMemo(() => {
    return lrt?.underlyingAssets.map((t) => t.asset) || [];
  }, [lrt]);

  const [isMounted, setIsMounted] = useState(false);
  const [amount, setAmount] = useState<bigint | null>(null);
  const [activeToken, setActiveToken] = useState<AssetDetails>(assets?.[0]);
  const [restakingTokenBalance, setAccountRestakingTokenBalance] = useState(
    BigInt(0)
  );
  const [amountOut, setAmountOut] = useState<bigint>(BigInt(0));
  const [isWithdrawalError, setIsWithdrawalError] = useState(false);
  const [isWithdrawalLoading, setIsWithdrawalLoading] = useState(false);
  const [isWithdrawalSuccess, setIsWithdrawalSuccess] = useState(false);
  const [exitTxHash, setExitTxHash] = useState<Hash>();

  const { address } = useAccount();

  const { refetch: refetchAssetBalance } = useAssetBalance(activeToken);
  const {
    data,
    isError,
    isLoading,
    refetch: refetchLrtBalance
  } = useAssetBalance(lrt);

  const isValidAmount =
    amount !== null && amount > BigInt(0) && amount <= restakingTokenBalance;

  const clearForm = () => {
    setAmount(null);
    assets[0] && setActiveToken(assets[0]);
  };

  useEffect(() => {
    if (!data) return;
    setAccountRestakingTokenBalance(data?.value);
  }, [data]);

  const restakingToken = useLiquidRestakingToken(lrt?.address as string);
  const queryTokens = async (
    restakingToken: LiquidRestakingTokenClient | null,
    activeToken: AssetDetails,
    amount: bigint | null
  ): Promise<bigint | undefined> => {
    if (amount === BigInt(0)) {
      return BigInt(0);
    }

    const query = await restakingToken?.getEstimatedOutForWithdrawalRequest({
      amountIn: amount || BigInt(0),
      assetOut: activeToken.address
    });
    return query as bigint;
  };

  const {
    data: txData,
    isError: isTxError,
    isLoading: isTxLoading
  } = useWaitForTransaction({
    hash: exitTxHash,
    enabled: !!exitTxHash
  });

  const handleTokenQuery = (res?: bigint | undefined) => {
    if (typeof res === 'undefined') return;
    setAmountOut(res);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!restakingToken) return;
    queryTokens(restakingToken, activeToken, amount)
      .then(handleTokenQuery)
      .catch(console.error);
  }, [amount, activeToken]);

  useEffect(() => {
    if (txData?.status === 'success') {
      setIsWithdrawalLoading(isTxLoading);
      setIsWithdrawalSuccess(true);
      amountOut && setAmountOut(BigInt(0));
      setAmount(null);
    }
    if (txData?.status === 'reverted') {
      setIsWithdrawalLoading(isTxLoading);
      setIsWithdrawalError(isTxError);
    }
    refetchLrtBalance().catch(console.error);
    refetchAssetBalance().catch(console.error);
  }, [txData]);

  const handleExitRequest = async () => {
    if (!restakingToken || !amount) return;

    await restakingToken
      ?.requestWithdrawal({
        amountIn: amount,
        assetOut: activeToken.address
      })
      .then((res) => {
        setExitTxHash(res);
        return res;
      })
      .catch((err) => {
        console.error('handleExitRequest err', err);
        setIsWithdrawalError(true);
        setIsWithdrawalLoading(false);
      });
  };

  const handleExecute = () => {
    setIsWithdrawalLoading(true);
    setIsWithdrawalError(false);
    setIsWithdrawalSuccess(false);
    setExitTxHash(undefined);
    handleExitRequest().catch(console.error);
  };

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
          {!!lrt && (
            <WithdrawField
              amount={amount}
              restakingTokenBalance={restakingTokenBalance}
              restakingToken={lrt}
              setAmount={setAmount}
            />
          )}
          {assets.length > 1 && (
            <WithdrawAssetSelector
              assetsList={assets}
              activeToken={activeToken}
              setActiveToken={setActiveToken}
            />
          )}
          <WithdrawItemized
            assets={assets}
            restakingToken={lrt}
            amount={amountOut}
            activeToken={activeToken}
          />
          {
            <WithdrawButton
              isValidAmount={isValidAmount}
              isEmpty={amount === null || amount === BigInt(0)}
              isWithdrawalLoading={isWithdrawalLoading}
              isWithdrawalSuccess={isWithdrawalSuccess}
              isWithdrawalError={isWithdrawalError}
              exitTxHash={exitTxHash}
              setIsWithdrawalSuccess={setIsWithdrawalSuccess}
              setIsWithdrawalError={setIsWithdrawalError}
              handleExecute={handleExecute}
              clearForm={clearForm}
            />
          }
        </>
      )}
    </>
  );
};

export default WithdrawForm;
