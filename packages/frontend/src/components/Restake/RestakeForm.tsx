import React, { useEffect, useState } from 'react';
import StakeField from './StakeField';
import { useAccount, useBalance } from 'wagmi';
import { Spinner } from '@material-tailwind/react';
import { AssetDetails } from '../../lib/typings';
import HR from '../Shared/HR';
import DepositButton from './DepositButton';
import { ethInUSD } from '../../../placeholder';
import { useLiquidRestakingToken } from '@rionetwork/sdk-react';
import { ASSET_ADDRESS } from '../../lib/constants';
import { truncDec } from '../../lib/utilities';
import { formatUnits, parseUnits } from 'viem';

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
  const query = restakingToken?.queryJoinTokensExactIn({
    tokensIn: [
      {
        address: ASSET_ADDRESS[activeToken.symbol] as string,
        amount: amount || BigInt(0)
      }
    ],
    slippage: 50
  });
  query
    ?.then((res) => {
      console.log('res', res);
    })
    .catch((err) => {
      console.log('err', err);
    });

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
          />
        </>
      )}
    </>
  );
};

export default RestakeForm;
