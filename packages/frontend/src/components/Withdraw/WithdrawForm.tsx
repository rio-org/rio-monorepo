import { Alert, Spinner } from '@material-tailwind/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useAccount, useBalance, useWaitForTransaction } from 'wagmi';
import { AssetDetails, LRTDetails } from '../../lib/typings';
import WithdrawAssetSelector from './WithdrawAssetSelector';
import WithdrawButton from './WithdrawButton';
import WithdrawField from './WithdrawField';
import WithdrawItemized from './WithdrawItemized';
import {
  useLiquidRestakingToken,
  LiquidRestakingTokenClient,
  ExitTokenExactInParams,
  OutputTokenMinOutWithUnwrap
} from '@rionetwork/sdk-react';
import { Hash } from 'viem';

const WithdrawForm = ({ lrtList }: { lrtList: LRTDetails[] }) => {
  // When more LRT products are available, we'll offer a way to switch these
  const [activeLrt] = useState<LRTDetails>(lrtList[0]);
  const assets = useMemo(() => {
    return activeLrt.underlyingTokens.map((t) => t.token);
  }, [activeLrt]);

  const [isMounted, setIsMounted] = useState(false);
  const [amount, setAmount] = useState<bigint | null>(null);
  const [activeToken, setActiveToken] = useState<AssetDetails>(assets[0]);
  const [accountReETHBalance, setAccountReETHBalance] = useState(BigInt(0));
  const [tokenOut, setTokenOut] = useState<OutputTokenMinOutWithUnwrap>();
  const [amountIn, setAmountIn] = useState<string | bigint>(BigInt(0));
  const [isExitError, setIsExitError] = useState(false);
  const [isExitLoading, setIsExitLoading] = useState(false);
  const [isExitSuccess, setIsExitSuccess] = useState(false);
  const [exitTxHash, setExitTxHash] = useState<Hash>();

  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
    token: activeLrt ? activeLrt.address : undefined
  });
  const isValidAmount =
    amount && amount > BigInt(0) && amount <= accountReETHBalance
      ? true
      : false;
  const clearForm = () => {
    setAmount(null);
    setActiveToken(assets[0]);
  };

  useEffect(() => {
    if (data) {
      setAccountReETHBalance(data?.value);
    }
  }, [data]);

  const restakingToken = useLiquidRestakingToken(activeLrt?.address as string);
  const queryTokens = async (
    restakingToken: LiquidRestakingTokenClient | null,
    activeToken: AssetDetails,
    amount: bigint | null
  ) => {
    const query = await restakingToken?.queryRequestExitTokenExactIn({
      amountIn: amount || BigInt(0),
      tokenOut: activeToken.address,
      slippage: 50
    });
    return query;
  };

  const {
    data: txData,
    isError: isTxError,
    isLoading: isTxLoading
  } = useWaitForTransaction({
    hash: exitTxHash,
    enabled: !!exitTxHash
  });

  const handleTokenQuery = (res?: ExitTokenExactInParams) => {
    if (!res) return;
    setAmountIn(res.amountIn);
    setTokenOut(res.tokenOut);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (restakingToken) {
      queryTokens(restakingToken, activeToken, amount)
        .then((res) => {
          handleTokenQuery(res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }, [amount, activeToken]);

  useEffect(() => {
    if (txData?.status === 'success') {
      setIsExitLoading(isTxLoading);
      setIsExitSuccess(true);
      amountIn && setAmountIn(BigInt(0));
      tokenOut && setTokenOut(undefined);
      setAmount(null);
    }
    if (txData?.status === 'reverted') {
      setIsExitLoading(isTxLoading);
      setIsExitError(isTxError);
    }
  }, [txData]);

  const handleExitRequest = async () => {
    if (!amount || !tokenOut || !restakingToken) return;
    await restakingToken
      ?.requestExitTokenExactIn({
        amountIn: amountIn,
        tokenOut: tokenOut
      })
      .then((res) => {
        setExitTxHash(res);
        return res;
      })
      .catch((err) => {
        console.log('handleExitRequest err', err);
        setIsExitError(true);
        setIsExitLoading(false);
      });
  };

  const handleExecute = () => {
    setIsExitLoading(true);
    setIsExitError(false);
    setIsExitSuccess(false);
    setExitTxHash(undefined);
    handleExitRequest().catch((e) => {
      console.error(e);
    });
  };

  if (isError) return <Alert color="red">Error loading account balance.</Alert>;
  if (isLoading)
    return (
      <div className="w-full text-center min-h-[100px] flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      {isMounted && !isLoading && (
        <>
          {!!activeLrt && (
            <WithdrawField
              amount={amount}
              accountReETHBalance={accountReETHBalance}
              reETHToken={activeLrt}
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
            amount={amount}
            activeToken={activeToken}
          />
          {address && (
            <WithdrawButton
              isValid={isValidAmount}
              isExitLoading={isExitLoading}
              isExitSuccess={isExitSuccess}
              isExitError={isExitError}
              accountAddress={address}
              exitTxHash={exitTxHash}
              setIsExitSuccess={setIsExitSuccess}
              setIsExitError={setIsExitError}
              handleExecute={handleExecute}
              clearForm={clearForm}
            />
          )}
        </>
      )}
    </>
  );
};

export default WithdrawForm;
