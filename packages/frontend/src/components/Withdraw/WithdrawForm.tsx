import { Alert, Spinner } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useWaitForTransaction
} from 'wagmi';
import { AssetDetails } from '../../lib/typings';
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
import { REETH_ADDRESS } from '../../lib/constants';
import { Hash, zeroAddress } from 'viem';
import ApproveButtons from '../Shared/ApproveButtons';

const WithdrawForm = ({ assets }: { assets: AssetDetails[] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [amount, setAmount] = useState<bigint | null>(null);
  const [activeToken, setActiveToken] = useState<AssetDetails>(assets[0]);
  const [accountReETHBalance, setAccountReETHBalance] = useState(BigInt(0));
  const [tokenOut, setTokenOut] = useState<OutputTokenMinOutWithUnwrap>();
  const [amountIn, setAmountIn] = useState<string | bigint>(BigInt(0));
  const [allowanceNote, setAllowanceNote] = useState<string | null>(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isExitError, setIsExitError] = useState(false);
  const [isExitLoading, setIsExitLoading] = useState(false);
  const [isExitSuccess, setIsExitSuccess] = useState(false);
  const [exitTxHash, setExitTxHash] = useState<Hash>();
  const reETHToken = assets.find((asset) => asset.symbol === 'reETH');
  const reETHAddress =
    assets.find((asset) => asset.symbol === 'reETH')?.address || REETH_ADDRESS;
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
    token: reETHToken ? reETHToken.address : undefined
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

  const restakingToken = useLiquidRestakingToken(reETHToken?.address as string);
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

  const { data: allowance, refetch } = useContractRead({
    address: reETHAddress || undefined,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address || zeroAddress, reETHAddress]
  });

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

  const handleRefetch = () => {
    refetch().catch((err) => {
      console.log('Error refetching allowance', err);
    });
  };

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
          {reETHToken && (
            <WithdrawField
              amount={amount}
              accountReETHBalance={accountReETHBalance}
              reETHToken={reETHToken}
              setAmount={setAmount}
            />
          )}
          <WithdrawAssetSelector
            assetsList={assets}
            activeToken={activeToken}
            setActiveToken={setActiveToken}
          />
          <WithdrawItemized amount={amount} activeToken={activeToken} />
          {isAllowed && address && (
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
          {!isAllowed && reETHToken && address && (
            <ApproveButtons
              allowanceTarget={reETHToken.address}
              accountAddress={address}
              isValidAmount={isValidAmount}
              amount={amount || BigInt(0)}
              token={reETHToken}
              refetchAllowance={handleRefetch}
            />
          )}
          <p className="text-sm text-center px-2 mt-2 text-gray-500 font-normal">
            {allowanceNote}
          </p>
        </>
      )}
    </>
  );
};

export default WithdrawForm;
