import { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { formatUnits, parseUnits } from 'viem';
import Skeleton from 'react-loading-skeleton';
import { twJoin } from 'tailwind-merge';
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
import { Button } from '@rio-monorepo/ui/components/shadcn/button';

type Props = {
  tab: string;
  activeToken?: AssetDetails;
  amount: string;
  disabled?: boolean;
  activeTokenBalance: bigint;
  restakingTokenBalance: bigint;
  lrtDetails?: LRTDetails;
  estimatedMaxGas?: bigint;
  setRestakingAmount: (amount: string) => void;
  setWithdrawalAmount: (amount: string) => void;
};

const RestakeField = ({
  tab,
  amount,
  activeToken,
  disabled,
  activeTokenBalance,
  restakingTokenBalance,
  lrtDetails,
  estimatedMaxGas,
  setRestakingAmount,
  setWithdrawalAmount
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

  const _maxAmountNotSafe =
    activeToken?.symbol === 'ETH'
      ? (activeTokenBalance ?? 0n) - (estimatedMaxGas ?? 0n)
      : activeTokenBalance ?? 0n;
  const maxAmount = _maxAmountNotSafe > 0n ? _maxAmountNotSafe : 0n;

  const token = tab === 'Restake' ? activeToken : lrtDetails;
  const balance = tab === 'Restake' ? maxAmount : restakingTokenBalance;
  const setAmount =
    tab === 'Restake' ? setRestakingAmount : setWithdrawalAmount;

  const usdAmount = useMemo(() => {
    const { usd, lrt } = exchangeRate || {};
    if (!activeToken || !usd || !lrt || !amount) return 0;
    return tab === 'Restake' ? +amount * usd : (parseFloat(amount) / lrt) * usd;
  }, [tab, amount, activeToken?.decimals, exchangeRate?.usd]);

  const handleEvaluateError = useCallback(
    (value: string) => {
      if (!value || !token) return;
      let message: string | null = null;
      const parsedValue = parseUnits(value, token.decimals || 18);
      const minAmount = parseUnits('0.01', token.decimals);

      message = !parsedValue
        ? 'Invalid amount'
        : tab === 'Restake' && parsedValue < minAmount
        ? `Minimum amount is 0.01 ${token.symbol}`
        : parsedValue > balance
        ? 'Insufficient balance'
        : token.symbol === 'ETH' && parsedValue > maxAmount
        ? 'Insufficient balance to pay for gas'
        : null;

      setErrorMessage(message);
      return !message;
    },
    [token, balance, maxAmount]
  );

  useEffect(() => {
    setRestakingAmount('');
    setWithdrawalAmount('');
    setErrorMessage(null);
    if (!inputRef.current) return;
    inputRef.current.focus();
    setIsFocused(true);
  }, [tab]);

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (!token || value === '') {
        return setAmount('');
      }

      const strippedValue = stripTokenDecimals(value, token.decimals);
      if (!strippedValue.match(/^0+(.0+)?$/)) {
        handleEvaluateError(strippedValue);
      }

      setAmount(strippedValue);
    },
    [tab, token, setAmount, errorMessage]
  );

  const focusInput = useCallback(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    setIsFocused(true);
  }, [inputRef]);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (!token) return;
      if (e.relatedTarget === maxButtonRef.current) return;
      handleEvaluateError(e.target.value);
    },
    [tab, token, maxButtonRef, handleEvaluateError]
  );

  const handleMaxAmount = useCallback(() => {
    const el = document.getElementById('input-amount') as HTMLInputElement;
    const _maxAmount = formatUnits(balance, token?.decimals || 18);
    setAmount(_maxAmount);
    if (!el || !token) return;
    el.value = _maxAmount;
    setErrorMessage(null);
  }, [token, balance]);

  const balanceExists =
    isMounted &&
    (tab === 'Restake'
      ? activeTokenBalance !== undefined && activeToken
      : restakingTokenBalance !== undefined && lrtDetails);

  const formattedBalance = !balanceExists
    ? undefined
    : tab === 'Restake'
    ? formatUnits(activeTokenBalance, activeToken!.decimals ?? 18)
    : formatUnits(restakingTokenBalance, lrtDetails!.decimals ?? 18);

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
        <label htmlFor="input-amount" className="mb-1 font-medium">
          Amount
        </label>
        <AccountBalance
          displayBalance={displayBalance}
          token={token}
          restakingTokenBalance={restakingTokenBalance}
          lrtDetails={lrtDetails}
          activeTokenBalance={activeTokenBalance}
          activeToken={activeToken}
        />
      </div>
      <div
        className={cn(
          'relative z-10 bg-input text-foreground p-4 rounded-[4px] border-border border transition-all',
          'hover:border-foregroundA1 focus:border-foregroundA2',
          isFocused && 'border-foregroundA2 hover:border-foregroundA2'
        )}
        onClick={focusInput}
      >
        <div className="relative z-10 flex flex-row gap-2 lg:gap-4 items-center">
          <div className="relative flex flex-col gap-1 w-full flex-1">
            {isMounted ? (
              <>
                <SymbolAnimator amount={amount} symbol={token?.symbol} />
                <input
                  className={cn(
                    'text-2xl bg-transparent w-full focus:outline-none pb-4 leading-none',
                    '[&::-webkit-inner-spin-button]:absolute',
                    '[&::-webkit-inner-spin-button]:right-0',
                    '[&::-webkit-inner-spin-button]:top-0',
                    '[&::-webkit-inner-spin-button]:bottom-0',
                    '[&::-webkit-inner-spin-button]:scale-75',
                    '[&::-webkit-inner-spin-button]:hidden',
                    '[&:not(:focus)]:text-ellipsis',
                    'pr-[75px] lg:pr-[95px]',
                    'lg:[&:hover+div]:flex',
                    'lg:[&:focus+div]:flex',
                    disabled && 'text-foregroundA7'
                  )}
                  id="input-amount"
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
                <InputSpinner
                  amount={amount}
                  setAmount={
                    tab === 'Restake' ? setRestakingAmount : setWithdrawalAmount
                  }
                />
                <span className="absolute left-0 bottom-0 text-xs tracking-tighter font-mono w-full opacity-50 max-w-full lg:pr-[20px] overflow-hidden text-ellipsis">
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
          <Button
            ref={maxButtonRef}
            disabled={disabled}
            id="withdraw-max"
            className={twJoin(
              'font-medium relative top-0 bottom-0',
              'transition-colors duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            onClick={handleMaxAmount}
            onBlur={() => {
              const withdrawInput = document.getElementById(
                'input-amount'
              ) as HTMLInputElement;
              if (!withdrawInput) return;
              handleEvaluateError(withdrawInput?.value ?? '');
            }}
          >
            Max
          </Button>
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
              'flex items-center gap-1.5',
              'w-full pt-2 pb-1 pl-1',
              'text-warning-foreground text-xs'
            )}
          >
            <IconWarning
              height={12}
              width={12}
              className="[&>path]:stroke-warning-foreground"
            />
            <span className="max-w-[calc(100%-20px)] overflow-hidden whitespace-nowrap text-ellipsis">
              {errorMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RestakeField;

////////////
// Subcomponents
////////////

function AccountBalance({
  displayBalance,
  token,
  restakingTokenBalance,
  lrtDetails,
  activeTokenBalance,
  activeToken
}: {
  displayBalance?: string;
  token?: LRTDetails | AssetDetails;
  restakingTokenBalance: bigint;
  lrtDetails?: LRTDetails;
  activeTokenBalance: bigint;
  activeToken?: AssetDetails;
}) {
  return (
    <>
      {typeof displayBalance !== 'undefined' ? (
        <span className="flex items-center gap-1">
          <span className="opacity-50 text-[13px] font-mono -tracking-tight lg:hidden">
            Balance: {displayBalance} {token?.symbol}
          </span>
          <span className="text-[13px] font-mono -tracking-tight lg-max:hidden">
            <span className="opacity-50 ">Balances:</span>{' '}
            {displayEthAmount(
              formatUnits(restakingTokenBalance, lrtDetails?.decimals ?? 18)
            )}{' '}
            {lrtDetails?.symbol} <span className="opacity-50 ">|</span>{' '}
            {displayEthAmount(
              formatUnits(activeTokenBalance, activeToken?.decimals ?? 18)
            )}{' '}
            {activeToken?.symbol}
          </span>
          {/* {formattedBalance &&
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
              )} */}
        </span>
      ) : (
        <Skeleton width={50} />
      )}
    </>
  );
}

function SymbolAnimator({
  amount,
  symbol
}: {
  amount: string;
  symbol?: string;
}) {
  const [symbolLetters, setSymbolLetters] = useState<
    { letter: string; index: number }[]
  >([]);
  useEffect(() => {
    if (!symbol) return;
    const letterCounts: Record<string, number> = {};
    const letters: { letter: string; index: number }[] = [];
    symbol.split('').forEach((letter) => {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      letters.push({ letter, index: letterCounts[letter] - 1 });
    });
    setSymbolLetters(letters);
  }, [symbol]);

  return (
    <div className="absolute flex items-start text-2xl leading-none -translate-y-[1px] bg-transparent w-full max-w-full lg:pr-[20px] pb-4 select-none pointer-events-none">
      <motion.div
        className="inline-block opacity-0 mr-2"
        key={(symbol ?? '') + 'number'}
        style={{
          maxWidth: `calc(100% - ${72}px)`,
          overflow: 'hidden'
        }}
      >
        {amount === '' ? '0.00' : amount}
      </motion.div>
      <span className="inline-block opacity-30 overflow-y-hidden whitespace-nowrap">
        <AnimatePresence>
          {!symbolLetters.length && <Skeleton width={40} />}
          {symbolLetters.map(({ letter, index }, i) => (
            <motion.span
              key={letter + index}
              initial={{ opacity: 0, translateY: 20, width: 0 }}
              animate={{
                opacity: 1,
                translateY: 2,
                width: 'auto'
              }}
              exit={{ opacity: 0, translateY: 20, width: 0 }}
              transition={{ delay: i * 0.1, duration: 0.2 }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
    </div>
  );
}

function InputSpinnerButton(props: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={twJoin(
        'flex-1 flex items-center justify-center',
        'aspect-square w-auto',
        'bg-background rounded-[4px] border border-border',
        'hover:bg-foreground hover:bg-opacity-[0.03] hover:border-foregroundA1',
        'active:bg-foregroundA1 active:border-foregroundA2 transition-colors'
      )}
      {...props}
    />
  );
}

function InputSpinner({
  amount,
  setAmount
}: {
  amount: string;
  setAmount: (amount: string) => void;
}) {
  return (
    <div className="hover:flex text-xs absolute z-[1] right-0 top-0 bottom-0 gap-1 hidden flex-col items-center justify-evenly">
      <InputSpinnerButton
        onClick={() =>
          setAmount(`${(Math.round(+amount || 0) * 100 + 1) / 100}`)
        }
      >
        +
      </InputSpinnerButton>
      <InputSpinnerButton
        onClick={() =>
          setAmount(
            `${Math.max(0, Math.round((+amount || 0) * 100 - 1) / 100)}`
          )
        }
      >
        -
      </InputSpinnerButton>
    </div>
  );
}
