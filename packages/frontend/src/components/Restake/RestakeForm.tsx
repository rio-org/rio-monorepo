import React, { useEffect, useState } from 'react';
import StakeField from './StakeField';
import { useAccount, useBalance } from 'wagmi';
import { Spinner } from '@material-tailwind/react';
import { AssetDetails } from '../../lib/typings';
import HR from '../Shared/HR';
import DepositButton from './DepositButton';
import { ethInUSD } from '../../../placeholder';
import { InputTokenWithWrap, JoinTokensExactInParams, LiquidRestakingTokenClient, useLiquidRestakingToken } from '@rionetwork/sdk-react';
import { ASSET_ADDRESS } from '../../lib/constants';
import { linkToTxOnBlockExplorer, truncDec } from '../../lib/utilities';
import { Hash, formatUnits, parseUnits } from 'viem';
import { AnimatePresence, motion } from 'framer-motion';
import IconExternal from '../Icons/IconExternal';
import { CHAIN_ID } from '../../../config';

const queryTokens = async (restakingToken: LiquidRestakingTokenClient | null, activeToken: AssetDetails, amount: bigint | null) => {
  const query = await restakingToken?.queryJoinTokensExactIn({
    tokensIn: [
      {
        address: ASSET_ADDRESS[activeToken.symbol] as string,
        amount: amount || BigInt(0)
      }
    ],
    slippage: 50
  });
  console.log('query', query);
  return query;
  // query
  //   ?.then((res: any) => {
  //     // setTokensIn(res.tokensIn);
  //     // setMinAmountOut(res.minAmountOut);
  //     console.log('res', res);
  //     // handleTokenQuery(res);
  //   })
  //   .catch((err: any) => {
  //     console.log('err', err);
  //   });
}

const RestakeForm = ({ assets }: { assets: AssetDetails[] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [amount, setAmount] = useState<bigint | null>(null);
  const [accountTokenBalance, setAccountTokenBalance] = useState(0);
  const [activeToken, setActiveToken] = useState<AssetDetails>(assets[0]);
  const { address } = useAccount();
  const rethToEth = 1.02;
  const { data, isError, isLoading } = useBalance({
    address: address,
    token: activeToken.address
      ? activeToken.symbol === 'ETH'
        ? undefined
        : activeToken.address
      : undefined
  });
  console.log('isError', isError);
  const isValidAmount =
    amount &&
    amount > BigInt(0) &&
    amount <= parseUnits(accountTokenBalance.toString(), activeToken.decimals);
  const isEmpty = !amount;

  const resetForm = () => {
    setAmount(null);
    setAccountTokenBalance(0);
    setActiveToken(assets[0]);
  };

  useEffect(() => {
    if (data) {
      setAccountTokenBalance(+data?.formatted);
    }
  }, [data]);

  useEffect(() => {
    setAmount(null);
  }, [accountTokenBalance]);

  useEffect(() => {
    !address && resetForm();
  }, [address]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rethAddress = ASSET_ADDRESS['reETH'] as string;
  const restakingToken = useLiquidRestakingToken(rethAddress);
  const [tokensIn, setTokensIn] = useState<InputTokenWithWrap[]>([]);
  const [minAmountOut, setMinAmountOut] = useState<string | bigint>(BigInt(0));

  useEffect(() => {
    if (restakingToken) {
      queryTokens(restakingToken, activeToken, amount).then((res) => {
        handleTokenQuery(res);
      });
    }
  }, [amount, activeToken]);

  // const query = restakingToken?.queryJoinTokensExactIn({
  //   tokensIn: [
  //     {
  //       address: ASSET_ADDRESS[activeToken.symbol] as string,
  //       amount: amount || BigInt(0)
  //     }
  //   ],
  //   slippage: 50
  // });
  // query
  //   ?.then((res) => {
  //     // setTokensIn(res.tokensIn);
  //     // setMinAmountOut(res.minAmountOut);
  //     console.log('res', res);
  //     // handleTokenQuery(res);
  //   })
  //   .catch((err) => {
  //     console.log('err', err);
  //   });

  const handleTokenQuery = (res?: JoinTokensExactInParams) => {
    if (!res) return;
    setTokensIn(res.tokensIn);
    setMinAmountOut(res.minAmountOut);
  }

  const [isJoinError, setIsJoinError] = useState(false);
  const [isJoinLoading, setIsJoinLoading] = useState(false);
  const [isJoinSuccess, setIsJoinSuccess] = useState(false);
  const [joinTxHash, setJoinTxHash] = useState<Hash | null>(null);
  const handleExecute = async () => {
    setIsJoinLoading(true);
    setIsJoinError(false);
    setIsJoinSuccess(false);
    setJoinTxHash(null);
    console.log('tokensIn', tokensIn);
    console.log('minAmountOut', minAmountOut);
    // returns transaction hash if successful
    const join = await restakingToken?.joinTokensExactIn({
      tokensIn: tokensIn,
      minAmountOut: minAmountOut
    }).then((res) => {
      console.log('success', res);
      setIsJoinSuccess(true);
      setIsJoinLoading(false);
      setJoinTxHash(res);
      return res;
    }
    ).catch((err) => {
      console.log('err', err);
      setIsJoinError(true);
      setIsJoinLoading(false);
    });
    console.log('join', join);

  }

  return (
    <>
      {isMounted && isLoading && (
        <div className="w-full text-center min-h-[100px] flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {/* {isMounted && isError && (
        <Alert color="red">Error loading account balance.</Alert>
      )} */}
      {isMounted && !isLoading && (
        <>
          <StakeField
            amount={amount}
            activeToken={activeToken}
            accountTokenBalance={accountTokenBalance}
            setAmount={setAmount}
            setActiveToken={setActiveToken}
            assets={assets}
          />
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-between text-[14px]">
              <span className="text-black opacity-50">Exchange rate</span>
              <strong className="text-right">
                1.00 reETH = {rethToEth} ETH (${ethInUSD})
              </strong>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-black opacity-50">Price impact</span>
              <strong className="text-right">0%</strong>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-black opacity-50">Reward fee</span>
              <strong className="text-right">10%</strong>
            </div>
          </div>
          <HR />
          <div className="flex justify-between text-[14px]">
            <span className="text-black opacity-50">Minimum received</span>
            <strong>
              {amount
                ? truncDec(
                  +formatUnits(amount, activeToken.decimals) * rethToEth,
                  2
                )
                : 0}{' '}
              reETH
            </strong>
          </div>
          <DepositButton
            isValidAmount={isValidAmount ? true : false}
            isEmpty={isEmpty ? true : false}
            isJoinLoading={isJoinLoading}
            isJoinSuccess={isJoinSuccess}
            isJoinError={isJoinError}
            transactionHash={joinTxHash}
            setIsJoinSuccess={setIsJoinSuccess}
            setIsJoinError={setIsJoinError}
            handleExecute={handleExecute}
          />
          <AnimatePresence>
            {isJoinSuccess && joinTxHash && (
              <motion.div
                className="mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div >
                  <a
                    href={linkToTxOnBlockExplorer(joinTxHash, CHAIN_ID)}
                    target="_blank"
                    rel="noreferrer"
                    className='flex flex-row justify-center text-center px-[8px] py-[2px] text-gray-500 font-normal whitespace-nowrap text-sm items-center rounded-full w-full gap-2 h-fit transition-colors duration-200 leading-none'

                  >
                    View transaction
                    <div className="opacity-50">
                      <IconExternal transactionStatus="None" />
                    </div>

                  </a>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )
      }
    </>
  );
};

export default RestakeForm;
