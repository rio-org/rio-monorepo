import React, { useEffect, useMemo, useState } from 'react';
import StakeField from './StakeField';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useWaitForTransaction
} from 'wagmi';
import { Alert, Spinner } from '@material-tailwind/react';
import { AssetDetails, EthereumAddress, LRTDetails } from '../../lib/typings';
import HR from '../Shared/HR';
import DepositButton from './DepositButton';
import {
  InputTokenExactInWithWrap,
  JoinTokensExactInParams,
  LiquidRestakingTokenClient,
  calcPriceImpact,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { ASSET_ADDRESS } from '../../lib/constants';
import { displayEthAmount, truncDec } from '../../lib/utilities';
import { Hash, formatUnits, zeroAddress } from 'viem';
import ApproveButtons from '../Shared/ApproveButtons';
import { useIsMounted } from '../../hooks/useIsMounted';
import { useAssetPriceUsd } from '../../hooks/useAssetPriceUsd';

const queryTokens = async (
  restakingToken: LiquidRestakingTokenClient | null,
  activeToken: AssetDetails,
  amount: bigint | null
) => {
  const query = await restakingToken?.queryJoinTokensExactIn({
    tokensIn: [
      {
        address: ASSET_ADDRESS[activeToken.symbol] as string,
        amount: amount || BigInt(0)
      }
    ],
    slippage: 50
  });
  return query;
};

const RestakeForm = ({ lrtList }: { lrtList: LRTDetails[] }) => {
  // When more LRT products are available, we'll offer a way to switch these
  const [activeLrt] = useState<LRTDetails>(lrtList[0]);
  const assets = useMemo(() => {
    return activeLrt.underlyingTokens.map((t) => t.token);
  }, [activeLrt]);

  const isMounted = useIsMounted();
  const [amount, setAmount] = useState<bigint | null>(null);
  const [accountTokenBalance, setAccountTokenBalance] = useState(BigInt(0));
  const [activeToken, setActiveToken] = useState<AssetDetails>(assets[0]);
  const [isJoinError, setIsJoinError] = useState(false);
  const [isJoinLoading, setIsJoinLoading] = useState(false);
  const [isJoinSuccess, setIsJoinSuccess] = useState(false);
  const [joinTxHash, setJoinTxHash] = useState<Hash>();
  const [allowanceTarget, setAllowanceTarget] = useState<EthereumAddress>();
  const [allowanceNote, setAllowanceNote] = useState<string | null>(null);
  const [tokensIn, setTokensIn] = useState<InputTokenExactInWithWrap[]>([]);
  const [minAmountOut, setMinAmountOut] = useState<string | bigint>(BigInt(0));
  const [isAllowed, setIsAllowed] = useState(false);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const restakingToken = useLiquidRestakingToken(activeLrt.address || '');
  const assetPriceUsd = useAssetPriceUsd(activeToken.address);
  const { address } = useAccount();

  // TODO: Get actual exchange rate
  const lrtAssetExchangeRate = 1.02;

  const { data, isError, isLoading } = useBalance({
    address: address,
    token: activeToken.address
      ? activeToken.symbol === 'ETH'
        ? undefined
        : activeToken.address
      : undefined
  });
  const isValidAmount =
    !!amount && amount > BigInt(0) && amount <= accountTokenBalance;
  const isEmpty = !amount;

  const resetForm = () => {
    setAmount(null);
    setIsJoinSuccess(false);
    setIsJoinError(false);
    setIsJoinLoading(false);
  };

  useEffect(() => {
    if (data) {
      setAccountTokenBalance(data?.value);
    }
  }, [data]);

  useEffect(() => {
    setAmount(null);
  }, [accountTokenBalance]);

  useEffect(() => {
    !address && resetForm();
    !address && setActiveToken(assets[0]);
  }, [address]);

  const { data: allowance, refetch } = useContractRead({
    address: activeToken.address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address || zeroAddress, allowanceTarget || zeroAddress],
    enabled:
      address && allowanceTarget && activeToken.symbol !== 'ETH' ? true : false
  });

  const handleRefetch = () => {
    refetch().catch((err) => {
      console.log('Error refetching allowance', err);
    });
  };

  useEffect(() => {
    resetForm(); // reset form when switching tokens
    if (!restakingToken || activeToken.symbol === 'ETH') {
      setAllowanceTarget(undefined);
      return;
    }
    if (restakingToken?.token?.gateway) {
      setAllowanceTarget(restakingToken.token.gateway as EthereumAddress);
    }
  }, [restakingToken, activeToken]);

  useEffect(() => {
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
      queryTokens(restakingToken, activeToken, amount)
        .then((res) => {
          res && handleTokenQuery(res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }, [amount, activeToken]);

  const handleTokenQuery = (res: JoinTokensExactInParams) => {
    if (!res) return;
    setTokensIn(res.tokensIn);
    setMinAmountOut(res.minAmountOut);
    if (!!restakingToken?.token && typeof res?.minAmountOut === 'bigint') {
      setPriceImpact(
        truncDec(
          calcPriceImpact(
            restakingToken.token,
            res.tokensIn.map((t) => t.amount.toString()),
            res.minAmountOut.toString(),
            true
          ) * 100,
          2
        ) || 0
      );
    }
  };

  const {
    data: txData,
    isError: isTxError,
    isLoading: isTxLoading
  } = useWaitForTransaction({
    hash: joinTxHash,
    enabled: !!joinTxHash
  });

  useEffect(() => {
    if (isTxLoading) {
      setIsJoinLoading(true);
      setIsJoinError(false);
      setIsJoinSuccess(false);
      return;
    }
    if (isTxError) {
      setIsJoinLoading(false);
      setIsJoinError(true);
      setIsJoinSuccess(false);
      return;
    }
    if (txData?.status === 'success') {
      setIsJoinLoading(false);
      setIsJoinError(false);
      setIsJoinSuccess(true);
      setAmount(null);
      return;
    }
    if (txData?.status === 'reverted') {
      setIsJoinLoading(false);
      setIsJoinError(true);
      setIsJoinSuccess(false);
      return;
    }
  }, [txData, isTxLoading, isTxError]);

  const handleJoin = async () => {
    await restakingToken
      ?.joinTokensExactIn({
        tokensIn: tokensIn,
        minAmountOut: minAmountOut
      })
      .then((res) => {
        setIsJoinSuccess(true);
        setIsJoinLoading(false);
        setJoinTxHash(res);
        return res;
      })
      .catch((err) => {
        console.log('err', err);
        setIsJoinError(true);
        setIsJoinLoading(false);
      });
  };

  const handleExecute = () => {
    setIsJoinLoading(true);
    setIsJoinError(false);
    setIsJoinSuccess(false);
    setJoinTxHash(undefined);
    handleJoin().catch((e) => {
      console.error(e);
    });
  };

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
            isDisabled={isJoinLoading}
            assets={assets}
            setAmount={setAmount}
            setActiveToken={setActiveToken}
          />
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-between text-[14px]">
              <span className="text-black opacity-50">Exchange rate</span>
              <strong className="text-right">
                1.00 {activeToken.symbol} ={' '}
                {(1 / lrtAssetExchangeRate).toLocaleString()} {activeLrt.symbol}{' '}
                <strong className="opacity-50">(${assetPriceUsd})</strong>
              </strong>
            </div>
            {assets.length > 1 && (
              <div className="flex justify-between text-[14px]">
                <span className="text-black opacity-50">Price impact</span>
                <strong className="text-right">{priceImpact ?? 0}%</strong>
              </div>
            )}
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
              isJoinLoading={isJoinLoading}
              isJoinSuccess={isJoinSuccess}
              isJoinError={isJoinError}
              accountAddress={address}
              joinTxHash={joinTxHash}
              setIsJoinSuccess={setIsJoinSuccess}
              setIsJoinError={setIsJoinError}
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
              refetchAllowance={handleRefetch}
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
