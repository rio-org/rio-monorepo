import React, { useEffect, useRef, useState } from 'react';
import { TokenSymbol } from '../../lib/typings';
import AssetSelector from './AssetSelector';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';
import { ethInUSD } from '../../../placeholder';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';

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
  const [isMounted, setIsMounted] = useState(false);
  const [usdAmount, setUsdAmount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const handleValueChange = (value: number) => {
    if (!value) value = 0;
    setAmount(value);
  };
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const focusInput = () => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    setIsFocused(true);
  };

  const unFocusInput = () => {
    if (!inputRef.current) return;
    setIsFocused(false);
    inputRef.current.blur();
  };

  useEffect(() => {
    setUsdAmount(amount ? amount * ethInUSD : 0);
  }, [amount]);

  return (
    <div
      className="hover:cursor-text"
      onClick={() => {
        isDesktopOrLaptop && focusInput();
      }}
    >
      <label htmlFor="amount" className="mb-1 font-medium">
        Amount
      </label>
      <div
        className={cx(
          'bg-black bg-opacity-5 text-black px-4 lg:px-[20px] py-4 rounded-xl border border-transparent hover:border-gray-300',
          isFocused && 'border-gray-400 hover:border-gray-400'
        )}
      >
        <div
          className="flex flex-row gap-4"
          style={{
            // required to allow mobile asset selector to act as a drawer
            position: isMounted && isDesktopOrLaptop ? 'relative' : 'inherit'
          }}
        >
          <input
            className="text-[22px] bg-transparent w-full focus:outline-none flex-1"
            id="amount"
            type="number"
            value={amount ? amount : ''}
            placeholder="0.00"
            autoFocus={isDesktopOrLaptop}
            min={0}
            step="0.1"
            ref={inputRef}
            onChange={(e) => {
              handleValueChange(+Number(e.target.value as string).toFixed(2));
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
            setIsFocused={setIsFocused}
            unFocusInput={unFocusInput}
          />
        </div>
        <div className="text-sm flex justify-between w-full mt-1">
          <span className="opacity-50">${usdAmount.toFixed(2)}</span>
          <div>
            {isMounted &&
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
