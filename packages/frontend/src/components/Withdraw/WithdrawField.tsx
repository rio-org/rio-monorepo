import React, { useEffect, useRef, useState } from 'react';
import { AssetDetails } from '../../lib/typings';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';
import { displayEthAmount, parseBigIntFieldAmount, truncDec } from '../../lib/utilities';
import { formatUnits, parseUnits } from 'viem';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';

type Props = {
  amount: bigint | null;
  accountReETHBalance: bigint;
  reETHToken: AssetDetails;
  setAmount: (amount: bigint | null) => void;
};

const WithdrawField = ({
  amount,
  accountReETHBalance,
  reETHToken,
  setAmount
}: Props) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleValueChange = (value: string) => {
    const parsedAmount = parseUnits(value, 18);
    if (value === '') {
      setAmount(null);
      return;
    }
    setAmount(parsedAmount);
  };
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

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
          reETH Amount
        </label>
        {hasMounted && accountReETHBalance !== undefined && reETHToken ? (
          <>
            <span className="opacity-50 text-[12px] -tracking-tight">
              Balance:{' '}{displayEthAmount(formatUnits(accountReETHBalance, reETHToken.decimals))}{' '}reETH
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
            className="text-[22px] bg-transparent w-full focus:outline-none flex-1"
            id="amount"
            type="number"
            placeholder="0.00"
            autoFocus={isDesktopOrLaptop}
            min={0}
            value={parseBigIntFieldAmount(amount, 18)}
            step="0.1"
            ref={inputRef}
            onChange={(e) => {
              handleValueChange(e.target.value as string);
            }}
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
              setAmount(accountReETHBalance);
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
