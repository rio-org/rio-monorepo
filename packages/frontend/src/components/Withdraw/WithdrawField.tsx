import { useCallback, useRef, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { formatUnits, parseUnits } from 'viem';
import Skeleton from 'react-loading-skeleton';
import { twJoin } from 'tailwind-merge';
import { InfoTooltip } from '@rio-monorepo/ui/components/Shared/InfoTooltip';
import { IconWarning } from '@rio-monorepo/ui/components/Icons/IconWarning';
import { useAssetExchangeRate } from '@rio-monorepo/ui/hooks/useAssetExchangeRate';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { DESKTOP_MQ } from '@rio-monorepo/ui/lib/constants';
import {
  cn,
  displayAmount,
  displayEthAmount,
  stripTokenDecimals
} from '@rio-monorepo/ui/lib/utilities';
import {
  type AssetDetails,
  type LRTDetails
} from '@rio-monorepo/ui/lib/typings';

type Props = {
  activeToken?: AssetDetails;
  amount: string;
  disabled?: boolean;
  restakingTokenBalance: bigint;
  lrtDetails?: LRTDetails;
  setAmount: (amount: string) => void;
};

const WithdrawField = ({
  amount,
  activeToken,
  disabled,
  restakingTokenBalance,
  lrtDetails,
  setAmount
}: Props) => {
  const isMounted = useIsMounted();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const maxButtonRef = useRef<HTMLButtonElement | null>(null);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  const { data: exchangeRate } = useAssetExchangeRate({
    asset: activeToken?.address,
    lrt: lrtDetails
  });

  const usdAmount = useMemo(() => {
    const { usd, lrt } = exchangeRate || {};
    if (!activeToken || !usd || !lrt) return 0;
    return amount ? (parseFloat(amount) / lrt) * usd : 0;
  }, [amount, activeToken?.decimals, exchangeRate?.usd]);

  const handleEvaluateError = useCallback(
    (value: string) => {
      if (!lrtDetails || !value) {
        return false;
      }

      const parsedValue = parseUnits(value, lrtDetails.decimals || 18);
      const message = !parsedValue
        ? 'Invalid amount'
        : parsedValue > restakingTokenBalance
        ? 'Insufficient balance'
        : null;

      setErrorMessage(message);
      return !message;
    },
    [lrtDetails, restakingTokenBalance]
  );

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (!lrtDetails || value === '') {
        return setAmount('');
      }

      const strippedValue = stripTokenDecimals(value, lrtDetails.decimals);

      if (!strippedValue.match(/^0+(.0+)?$/)) {
        handleEvaluateError(strippedValue);
      }

      setAmount(strippedValue);
    },
    [restakingTokenBalance, lrtDetails, errorMessage]
  );

  const focusInput = useCallback(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    setIsFocused(true);
  }, [inputRef]);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (!lrtDetails) return;
      if (e.relatedTarget === maxButtonRef.current) return;
      handleEvaluateError(e.target.value);
    },
    [lrtDetails, maxButtonRef, handleEvaluateError]
  );

  const handleMaxAmount = useCallback(() => {
    const el = document.getElementById('withdraw-amount') as HTMLInputElement;
    const _maxAmount = formatUnits(
      restakingTokenBalance,
      activeToken?.decimals || 18
    );
    setAmount(_maxAmount);
    if (!el || !lrtDetails) return;
    el.value = _maxAmount;
    setErrorMessage(null);
  }, [restakingTokenBalance, lrtDetails]);

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
    <motion.div
      className="relative w-full"
      style={{
        willChange: 'margin-bottom',
        marginBottom: errorMessage ? '40px' : '0px',
        transition: 'margin-bottom 0.2s ease'
      }}
    >
      <div className="flex flex-row justify-between gap-4">
        <label htmlFor="withdraw-amount" className="mb-1 font-medium">
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
                <InfoTooltip>
                  <p>
                    <span className="font-semibold block">Exact balance</span>
                    <span className="block">
                      {formattedBalance} {lrtDetails?.symbol}
                    </span>
                  </p>
                </InfoTooltip>
              )}
          </span>
        ) : (
          <Skeleton width={50} />
        )}
      </div>
      <div
        className={cn(
          'relative z-10 bg-black bg-opacity-5 text-black px-[20px] py-4 rounded-xl hover:border-gray-300 border border-transparent transition-all',
          errorMessage && 'rounded-b-none',
          isFocused && 'border-gray-400 hover:border-gray-400'
        )}
        onClick={focusInput}
      >
        <div className="relative z-10 flex flex-row gap-4 items-center">
          <div className="relative flex flex-col gap-1 w-full flex-1">
            {isMounted ? (
              <>
                <input
                  className={cn(
                    'text-[22px] bg-transparent w-full focus:outline-none pb-4',
                    '[&::-webkit-inner-spin-button]:absolute',
                    '[&::-webkit-inner-spin-button]:right-0',
                    '[&::-webkit-inner-spin-button]:top-0',
                    '[&::-webkit-inner-spin-button]:bottom-0',
                    '[&::-webkit-inner-spin-button]:scale-75',
                    disabled && 'text-gray-700'
                  )}
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  autoFocus={!disabled && isDesktopOrLaptop}
                  min={0}
                  disabled={disabled}
                  value={amount}
                  step="0.01"
                  ref={inputRef}
                  onFocus={() => setIsFocused(true)}
                  onChange={handleValueChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      handleEvaluateError(e.currentTarget.value);
                    }
                    if (e.key.length === 1 && e.key.match(/e|\+|-/gi)) {
                      e.preventDefault();
                    }
                  }}
                />
                <span className="absolute left-0 bottom-0 text-xs tracking-tighter font-mono w-full opacity-50">
                  ${!usdAmount ? '0' : displayAmount(usdAmount, 2, 2)}
                </span>
              </>
            ) : (
              <>
                <Skeleton width={50} height={29} />
                <div className="max-h-[12px] [&_span]:inline-block [&_span]:max-h-[12px] -translate-y-1">
                  <Skeleton width={20} />
                </div>
              </>
            )}
          </div>
          <button
            ref={maxButtonRef}
            disabled={disabled}
            id="withdraw-max"
            className={twJoin(
              'ml-2 px-3 py-2 font-medium',
              'bg-[var(--color-element-wrapper-bg)] rounded-xl',
              'enabled:hover:bg-black enabled:hover:bg-opacity-10 transition-colors duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            onClick={handleMaxAmount}
            onBlur={() => {
              const withdrawInput = document.getElementById(
                'withdraw-amount'
              ) as HTMLInputElement;
              if (!withdrawInput) return;
              handleEvaluateError(withdrawInput?.value ?? '');
            }}
          >
            Max
          </button>
        </div>
      </div>
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: '100%' }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className={twJoin(
              'absolute bottom-0 left-0',
              'flex items-center gap-2',
              'w-full bg-gray-300 py-1 px-4 rounded-b-xl',
              'text-black text-xs'
            )}
          >
            <IconWarning height={12} width={12} />
            <span className="max-w-[calc(100%-20px)] overflow-hidden whitespace-nowrap text-ellipsis">
              {errorMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WithdrawField;
