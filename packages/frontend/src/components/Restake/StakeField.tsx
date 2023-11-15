import React, { useEffect, useRef, useState } from 'react';
import { TokenSymbol } from '../../lib/typings';
import AssetSelector from './AssetSelector';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';
import { ethInUSD } from '../../../placeholder';

type Props = {
  amount: number | null;
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
  const [isFocused, setIsFocused] = useState(false);
  const handleValueChange = (value: number) => {
    if (!value) value = 0;
    setAmount(value);
    console.log('ethInUSD', ethInUSD);
    console.log('value', value);
    setUsdAmount(value * ethInUSD);
  };
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const focusInput = () => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    setIsFocused(true);
  };

  return (
    <div
      className="hover:cursor-text"
      onClick={() => {
        focusInput();
      }}
    >
      <label htmlFor="amount" className="mb-1 font-medium">
        Amount
      </label>
      <div
        className={cx(
          'bg-black bg-opacity-5 text-black px-[20px] py-4 rounded-xl border border-transparent hover:border-gray-300',
          isFocused && 'border-gray-400 hover:border-gray-400'
        )}
      >
        <div className="relative flex flex-row gap-4">
          <input
            className="text-[22px] bg-transparent w-full focus:outline-none flex-1"
            id="amount"
            type="number"
            value={amount ? amount : ''}
            placeholder="0.00"
            autoFocus
            ref={inputRef}
            onChange={(e) => {
              handleValueChange(parseInt(e.target.value as string));
            }}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
          />
          <AssetSelector
            activeTokenSymbol={activeTokenSymbol}
            setActiveTokenSymbol={setActiveTokenSymbol}
          />
        </div>
        <div className="text-sm flex justify-between w-full mt-1">
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
