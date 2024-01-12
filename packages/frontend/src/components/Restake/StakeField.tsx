import React, { useMemo, useRef, useState } from 'react';
import { AssetDetails } from '../../lib/typings';
import AssetSelector from './AssetSelector';
import Skeleton from 'react-loading-skeleton';
import cx from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';
import { displayEthAmount, parseBigIntFieldAmount } from '../../lib/utilities';
import { formatUnits, parseUnits } from 'viem';
import { useAssetPriceUsd } from '../../hooks/useAssetPriceUsd';
import { useIsMounted } from '../../hooks/useIsMounted';

type Props = {
  activeToken: AssetDetails;
  amount: bigint | null;
  accountTokenBalance: bigint;
  assets: AssetDetails[];
  isDisabled: boolean;
  setAmount: (amount: bigint | null) => void;
  setActiveToken: (asset: AssetDetails) => void;
};

const StakeField = ({
  amount,
  activeToken,
  accountTokenBalance,
  assets,
  isDisabled,
  setAmount,
  setActiveToken
}: Props) => {
  const isMounted = useIsMounted();
  const [isFocused, setIsFocused] = useState(false);

  const assetPriceUsd = useAssetPriceUsd(activeToken.address);
  const usdAmount = useMemo(() => {
    return amount
      ? +formatUnits(amount, activeToken.decimals) * assetPriceUsd
      : 0;
  }, [amount, activeToken.decimals, assetPriceUsd]);

  const handleValueChange = (value: string) => {
    const parsedAmount = parseUnits(value, activeToken.decimals);
    if (value === '') {
      setAmount(null);
      return;
    }
    setAmount(parsedAmount);
  };
  const handleMaxBalance = (balanceAmount: bigint) => {
    setAmount(balanceAmount);
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

  const unFocusInput = () => {
    if (!inputRef.current) return;
    setIsFocused(false);
    inputRef.current.blur();
  };

  return (
    <div
      className="hover:cursor-text"
      onClick={() => {
        isDesktopOrLaptop && focusInput();
      }}
    >
      <label htmlFor="amount" className="mb-1 font-medium block">
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
            placeholder="0.00"
            autoFocus={isDesktopOrLaptop}
            min={0}
            value={parseBigIntFieldAmount(amount, activeToken.decimals)}
            step="0.1"
            ref={inputRef}
            onChange={(e) => {
              handleValueChange(e.target.value);
            }}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
          />
          <AssetSelector
            activeTokenSymbol={activeToken.symbol}
            assets={assets}
            isDisabled={isDisabled}
            setActiveToken={setActiveToken}
            setIsFocused={setIsFocused}
            unFocusInput={unFocusInput}
          />
        </div>
        <div className="text-sm flex justify-between w-full mt-1">
          <span className="opacity-50">
            ${usdAmount.toFixed(2).toLocaleString()}
          </span>
          <div>
            {isMounted &&
            accountTokenBalance !== undefined &&
            activeToken.symbol ? (
              <>
                <span className="opacity-50">
                  Balance:{' '}
                  {displayEthAmount(
                    formatUnits(accountTokenBalance, activeToken.decimals)
                  )}{' '}
                  {activeToken.symbol}
                </span>{' '}
                <button
                  className="text-[color:var(--color-blue)] font-medium underline mx-1 hover:[color:var(--color-light-blue)]"
                  onClick={() => {
                    handleMaxBalance(accountTokenBalance);
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
