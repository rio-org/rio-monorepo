import React, { useEffect, useState } from 'react';
import StakeField from './StakeField';
import { useAccount, useBalance } from 'wagmi';
import cx from 'classnames';
import { Alert, Spinner } from '@material-tailwind/react';
import { TokenSymbol } from '../../lib/typings';
import { ASSETS } from '../../lib/constants';

const RestakeForm = () => {
  const [amount, setAmount] = useState(0);
  const [accountTokenBalance, setAccountTokenBalance] = useState(0);
  const [activeTokenSymbol, setActiveTokenSymbol] =
    useState<TokenSymbol>('ETH');
  const { address } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
    token:
      activeTokenSymbol === 'ETH'
        ? undefined
        : ASSETS[activeTokenSymbol].address
  });
  console.log(ASSETS[activeTokenSymbol].address);
  const isValidAmount = amount > 0 && amount <= accountTokenBalance;
  useEffect(() => {
    if (data) {
      console.log('data', data);
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
      <hr className="my-2 border-t border-black border-opacity-50 border-dotted bg-transparent " />
      <div className="flex justify-between text-[14px]">
        <span className="text-black opacity-50">Minimum received</span>
        <strong>XX reETH</strong>
      </div>
      <button
        className={cx(
          'mt-4 rounded-full w-full py-3 font-bold bg-black text-white transition-colors duration-200',
          !isValidAmount && 'bg-opacity-20',
          isValidAmount && 'hover:bg-[var(--color-dark-gray)]'
        )}
        disabled={!isValidAmount}
        onClick={() => {
          console.log('restake');
        }}
      >
        <span className={cx(!isValidAmount && 'opacity-20 text-black')}>
          {isValidAmount ? 'Restake' : 'Enter an amount'}
        </span>
      </button>
    </>
  );
};

export default RestakeForm;
