import React, { useEffect, useRef, useState } from 'react';
import { TokenSymbol } from '../../lib/typings';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';

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
  const [isFocused, setIsFocused] = useState(false);
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = +Number(e.target.value);
    if (val >= 0) {
      setAmount(+val.toFixed(2));
    }
  };
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    setIsFocused(true);
  };
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div>
      <div className="flex flex-row justify-between gap-4">
        <label htmlFor="amount" className="mb-1 font-medium">
          Amount
        </label>
        {hasMounted &&
        accountTokenBalance !== undefined &&
        activeTokenSymbol ? (
          <>
            <span className="opacity-50 text-[12px] -tracking-tight">
              Balance: {Math.trunc(accountTokenBalance * 1000) / 1000} reETH
            </span>{' '}
          </>
        ) : (
          <Skeleton width={50} />
        )}
      </div>
      <div
        className={cx(
          'bg-black bg-opacity-5 text-black px-[20px] py-4 rounded-xl hover:border-gray-300 border border-transparent',
          isFocused && 'border-gray-400 hover:border-gray-400'
        )}
        onClick={() => {
          focusInput();
        }}
      >
        <div className="relative flex flex-row gap-4 items-center">
          <input
            className="text-[22px] bg-transparent w-full focus:outline-none"
            id="amount"
            type="number"
            value={amount ? amount : ''}
            placeholder="0.00"
            onChange={(e) => {
              handleValueChange(e);
            }}
            autoFocus
            ref={inputRef}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
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
