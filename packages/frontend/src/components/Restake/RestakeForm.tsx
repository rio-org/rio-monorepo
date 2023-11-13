import React, { useEffect, useState } from 'react';
import StakeField from './StakeField';
import { useAccount, useBalance } from 'wagmi';
import { Alert, Spinner } from '@material-tailwind/react';
import { EthereumAddress, TokenSymbol } from '../../lib/typings';
import { ASSETS } from '../../lib/constants';
import HR from '../Shared/HR';
import DepositButton from './DepositButton';

const RestakeForm = () => {
  const [amount, setAmount] = useState(0);
  const [accountTokenBalance, setAccountTokenBalance] = useState(0);
  const [activeTokenSymbol, setActiveTokenSymbol] =
    useState<TokenSymbol>('ETH');
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
    token: ASSETS[activeTokenSymbol].address
      ? (ASSETS[activeTokenSymbol].address as EthereumAddress)
      : undefined
  });
  const isValidAmount = amount > 0 && amount <= accountTokenBalance;
  useEffect(() => {
    if (data) {
      setAccountTokenBalance(+data?.formatted);
      setActiveTokenSymbol(data?.symbol as TokenSymbol);
    }
  }, [data]);

  if (isError) return <Alert color="red">Error loading account balance.</Alert>;
  if (isLoading)
    return (
      <div className="w-full text-center min-h-[100px] flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <StakeField
        amount={amount}
        accountTokenBalance={accountTokenBalance}
        activeTokenSymbol={activeTokenSymbol}
        setAmount={setAmount}
        setActiveTokenSymbol={setActiveTokenSymbol}
      />
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Exchange rate</span>
          <strong>1.00 reETH = 1.02 ETH ($1,789.28)</strong>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Price impact</span>
          <strong>0%</strong>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Reward fee</span>
          <strong>10%</strong>
        </div>
      </div>
      <HR />
      <div className="flex justify-between text-[14px]">
        <span className="text-black opacity-50">Minimum received</span>
        <strong>XX reETH</strong>
      </div>
      <DepositButton isValidAmount={isValidAmount} />
    </>
  );
};

export default RestakeForm;
