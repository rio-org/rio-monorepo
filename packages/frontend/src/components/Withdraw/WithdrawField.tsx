import React, { useRef, useState } from 'react';
import { LRTDetails } from '@rio-monorepo/ui/lib/typings';
import Skeleton from 'react-loading-skeleton';
import {
  cn,
  displayEthAmount,
  parseBigIntFieldAmount
} from '@rio-monorepo/ui/lib/utilities';
import { formatUnits, parseUnits } from 'viem';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '@rio-monorepo/ui/lib/constants';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { IconInfo } from '@rio-monorepo/ui/components/Icons/IconInfo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@rio-monorepo/ui/components/shadcn/tooltip';

type Props = {
  amount: bigint | null;
  disabled?: boolean;
  restakingTokenBalance: bigint;
  lrtDetails?: LRTDetails;
  setAmount: (amount: bigint | null) => void;
};

const WithdrawField = ({
  amount,
  disabled,
  restakingTokenBalance,
  lrtDetails,
  setAmount
}: Props) => {
  const isMounted = useIsMounted();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  const handleValueChange = (value: string) => {
    if (value === '') return setAmount(null);
    setAmount(parseUnits(value, 18));
  };

  const focusInput = () => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    setIsFocused(true);
  };

  const balanceExists =
    isMounted && restakingTokenBalance !== undefined && lrtDetails;

  const formattedBalance = !balanceExists
    ? undefined
    : formatUnits(restakingTokenBalance, lrtDetails.decimals ?? 18);

  const displayBalance =
    typeof formattedBalance === 'undefined'
      ? undefined
      : displayEthAmount(formattedBalance);

  return (
    <div>
      <div className="flex flex-row justify-between gap-4">
        <label htmlFor="amount" className="mb-1 font-medium">
          reETH Amount
        </label>
        {typeof displayBalance !== 'undefined' ? (
          <span className="flex items-center gap-1">
            <span className="opacity-50 text-[12px] -tracking-tight">
              Balance: {displayBalance} {lrtDetails?.symbol}
            </span>
            {formattedBalance &&
              (isNaN(+displayBalance) ||
                +displayBalance !== +formattedBalance) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <IconInfo />
                    </TooltipTrigger>
                    <TooltipContent side="top" align="end">
                      <p>
                        <span className="font-semibold block">
                          Exact balance
                        </span>
                        <span className="block">
                          {formattedBalance} {lrtDetails?.symbol}
                        </span>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
          </span>
        ) : (
          <Skeleton width={50} />
        )}
      </div>
      <div
        className={cn(
          'bg-black bg-opacity-5 text-black px-[20px] py-4 rounded-xl hover:border-gray-300 border border-transparent',
          isFocused && 'border-gray-400 hover:border-gray-400'
        )}
        onClick={() => {
          focusInput();
        }}
      >
        <div className="relative flex flex-row gap-4 items-center">
          {isMounted ? (
            <input
              className={cn(
                'text-[22px] bg-transparent w-full focus:outline-none flex-1',
                disabled && 'text-gray-700'
              )}
              id="amount"
              type="number"
              placeholder="0.00"
              autoFocus={!disabled && isDesktopOrLaptop}
              min={0}
              disabled={disabled}
              value={parseBigIntFieldAmount(amount, 18)}
              step="0.01"
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
          ) : (
            <div className="w-full flex-1">
              <Skeleton width={50} height={26} />
            </div>
          )}
          <button
            disabled={disabled}
            className="font-medium ml-2 px-3 py-2 bg-[var(--color-element-wrapper-bg)] rounded-xl hover:bg-black hover:bg-opacity-10 transition-colors duration-200"
            onClick={() => {
              setAmount(restakingTokenBalance);
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
