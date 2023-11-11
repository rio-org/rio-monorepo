import React, { useEffect, useState } from 'react';
import { TokenSymbol } from '../../lib/typings';
// import AssetSelector from './AssetSelector';
import Skeleton from 'react-loading-skeleton';

type Props = {
  amount: number;
  accountTokenBalance: number;
  activeTokenSymbol: TokenSymbol;
  setAmount: (amount: number) => void;
};

const WithdrawField = ({
  amount,
  accountTokenBalance,
  activeTokenSymbol,
  setAmount
}: Props) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [usdAmount, setUsdAmount] = useState(0);

  const handleValueChange = (value: number) => {
    if (!value) value = 0;
    setAmount(value);
    setUsdAmount(value);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div>
      <div className='flex flex-row justify-between gap-4'>
        <label htmlFor="amount" className="mb-1 font-medium">
          Amount
        </label>
        {hasMounted &&
          accountTokenBalance !== undefined &&
          activeTokenSymbol ? (
          <>
            <span className="opacity-50 text-[12px] -tracking-tight">
              Balance: {accountTokenBalance.toFixed(2)} reETH
            </span>{' '}

          </>
        ) : (
          <Skeleton width={50} />
        )}
      </div>
      <div className="bg-black bg-opacity-5 text-black px-[20px] py-4 rounded-xl">
        <div className="relative flex flex-row gap-4 items-center">
          <input
            className="text-[22px] bg-transparent w-full"
            id="amount"
            type="number"
            value={amount}
            placeholder="0.00"
            onChange={(e) => {
              handleValueChange(parseInt(e.target.value as string));
            }}
          />
          <button
            className="font-medium ml-2 px-3 py-2 bg-[var(--color-element-wrapper-bg)] rounded-xl hover:bg-black hover:bg-opacity-10 transition-colors duration-200"
            onClick={() => {
              setAmount(accountTokenBalance);
            }}
          >
            Max
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawField;
