import React, { useEffect, useState } from 'react';
import { TokenSymbol } from '../../lib/typings';
import AssetSelector from './AssetSelector';
import Skeleton from 'react-loading-skeleton';

type Props = {
  amount: number;
  accountTokenBalance: number;
  activeTokenSymbol: TokenSymbol;
  setAmount: (amount: number) => void;
  setActiveTokenSymbol: (symbol: TokenSymbol) => void;
};

const StakeField = ({
  amount,
  accountTokenBalance,
  activeTokenSymbol,
  setAmount,
  setActiveTokenSymbol
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
      <label htmlFor="amount" className="mb-1 font-medium">
        Amount
      </label>
      <div className="bg-black bg-opacity-5 text-black px-[20px] py-4 rounded-xl">
        <div className="relative flex flex-row gap-4">
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
          <AssetSelector
            activeTokenSymbol={activeTokenSymbol}
            setActiveTokenSymbol={setActiveTokenSymbol}
          />
        </div>
        <div className="text-sm flex justify-between w-full">
          <span className="opacity-50">${usdAmount}</span>
          <div>
            {hasMounted &&
            accountTokenBalance !== undefined &&
            activeTokenSymbol ? (
              <>
                <span className="opacity-50">
                  Balance: {accountTokenBalance.toFixed(2)} {activeTokenSymbol}
                </span>{' '}
                <button
                  className="text-[color:var(--color-blue)] font-medium underline ml-2 hover:[color:var(--color-light-blue)]"
                  onClick={() => {
                    setAmount(accountTokenBalance);
                  }}
                >
                  Max
                </button>
              </>
            ) : (
              <Skeleton width={50} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeField;
