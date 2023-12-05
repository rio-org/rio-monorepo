import React, { useEffect, useState } from 'react';
import StakeField from './StakeField';
import { useAccount, useBalance } from 'wagmi';
import { Spinner } from '@material-tailwind/react';
import { AssetDetails, TokenSymbol } from '../../lib/typings';
import HR from '../Shared/HR';
import DepositButton from './DepositButton';
import { ethInUSD } from '../../../placeholder';
import {
  InputTokenWithWrap,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { ASSET_ADDRESS } from '../../lib/constants';

const RestakeForm = ({ assets }: { assets: AssetDetails[] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [accountTokenBalance, setAccountTokenBalance] = useState(0);
  const [activeTokenSymbol, setActiveTokenSymbol] =
    useState<TokenSymbol>('ETH');
  const { address } = useAccount();
  const activeAsset = assets[0];
  const rethToEth = 1.02;
  const { data, isError, isLoading } = useBalance({
    address: address,
    token: activeAsset.address ? activeAsset.address : undefined
  });
  console.log('isError', isError);
  const isValidAmount = amount && amount > 0 && amount <= accountTokenBalance;
  const isEmpty = !amount;

  const resetForm = () => {
    setAmount(null);
    setAccountTokenBalance(0);
    setActiveTokenSymbol('ETH');
  };

  useEffect(() => {
    if (data) {
      setAccountTokenBalance(+data?.formatted);
      setActiveTokenSymbol(data?.symbol as TokenSymbol);
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

  const [tokensIn, setTokensIn] = useState<InputTokenWithWrap[]>();
  const rethAddress = ASSET_ADDRESS['reETH'] as string;
  const restakingToken = useLiquidRestakingToken(rethAddress);
  const query = restakingToken
    ?.queryJoinTokensExactIn({
      tokensIn: [
        {
          address: ASSET_ADDRESS['WETH'] as string,
          amount: BigInt(amount || 0)
        }
      ],
      slippage: 50
    })
    .then((res) => {
      setTokensIn(res.tokensIn);
      console.log('response', res);
    })
    .catch((err) => {
      console.log('query err', err);
    });
  console.log('tokensIn', tokensIn);
  console.log('restakingToken?.queryJoinTokensExactIn', query);

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
            accountTokenBalance={accountTokenBalance}
            activeTokenSymbol={activeTokenSymbol}
            setAmount={setAmount}
            setActiveTokenSymbol={setActiveTokenSymbol}
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
              {amount ? (amount * rethToEth).toFixed(2) : 0} reETH
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
