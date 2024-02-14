import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatUnits, parseUnits } from 'viem';
import Skeleton from 'react-loading-skeleton';
import { twJoin } from 'tailwind-merge';
import { IconWarning } from '@rio-monorepo/ui/components/Icons/IconWarning';
import InputField from '@rio-monorepo/ui/components/Shared/InputField';
import AssetSelector from './AssetSelector';
import { useAssetExchangeRate } from '@rio-monorepo/ui/hooks/useAssetExchangeRate';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import {
  type AssetDetails,
  type LRTDetails
} from '@rio-monorepo/ui/lib/typings';
import {
  cn,
  displayAmount,
  displayEthAmount,
  parseBigIntFieldAmount
} from '@rio-monorepo/ui/lib/utilities';

type Props = {
  activeToken?: AssetDetails;
  amount: bigint | null;
  accountTokenBalance: bigint;
  assets: AssetDetails[];
  isDisabled: boolean;
  estimatedMaxGas?: bigint;
  lrt?: LRTDetails;
  setAmount: (amount: bigint | null) => void;
  setActiveToken: (asset: AssetDetails) => void;
};

const StakeField = ({
  amount,
  activeToken,
  accountTokenBalance,
  assets,
  isDisabled,
  lrt,
  estimatedMaxGas,
  setAmount,
  setActiveToken
}: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxButtonRef = useRef<HTMLButtonElement | null>(null);

  const { address } = useAccountIfMounted();
  const isMounted = useIsMounted();
  const { data: exchangeRate } = useAssetExchangeRate({
    asset: activeToken?.address,
    lrt
  });

  const _maxAmountNotSafe =
    activeToken?.symbol === 'ETH'
      ? (accountTokenBalance ?? 0n) - (estimatedMaxGas ?? 0n)
      : accountTokenBalance ?? 0n;
  const maxAmount = _maxAmountNotSafe > 0n ? _maxAmountNotSafe : 0n;

  const usdAmount = useMemo(() => {
    if (!activeToken || !exchangeRate?.usd) return 0;
    return amount
      ? +formatUnits(amount, activeToken.decimals) * exchangeRate.usd
      : 0;
  }, [amount, activeToken?.decimals, exchangeRate?.usd]);

  const handleValueChange = useCallback(
    (value: string) => {
      if (!activeToken || value === '') {
        return setAmount(null);
      }

      const parsedValue = parseUnits(value, activeToken?.decimals);
      if (errorMessage && parsedValue > 0n && parsedValue <= maxAmount) {
        setErrorMessage(null);
      }

      setAmount(parsedValue);
    },
    [activeToken, maxAmount, errorMessage]
  );

  const handleMaxBalance = useCallback(() => {
    const el = document.getElementById('restake-amount') as HTMLInputElement;
    setAmount(maxAmount);
    if (!el || !activeToken) return;
    el.value = formatUnits(maxAmount, activeToken.decimals);
    setErrorMessage(null);
  }, [maxAmount, activeToken]);

  const unFocusInput = useCallback(() => {
    if (assets.length <= 1) return;
    inputRef.current?.blur();
  }, [inputRef, assets]);

  const handleEvaluateError = useCallback(
    (value: string) => {
      if (!activeToken || !value) {
        return false;
      }

      const parsedValue = parseUnits(value, activeToken.decimals);
      const message = !parsedValue
        ? 'Invalid amount'
        : parsedValue > accountTokenBalance
        ? 'Insufficient balance'
        : activeToken.symbol === 'ETH' && parsedValue > maxAmount
        ? 'Insufficient balance to pay for gas'
        : null;

      setErrorMessage(message);
      return !message;
    },
    [activeToken, maxAmount, maxButtonRef]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (!activeToken) return;
      if (e.relatedTarget === maxButtonRef.current) return;
      handleEvaluateError(e.target.value);
    },
    [accountTokenBalance, activeToken, maxAmount, maxButtonRef]
  );

  return (
    <motion.div
      className="relative w-full"
      style={{
        willChange: 'margin-bottom',
        marginBottom: errorMessage ? '40px' : '0px',
        transition: 'margin-bottom 0.2s ease'
      }}
    >
      <InputField
        ref={inputRef}
        title="Amount"
        id="restake-amount"
        type="number"
        placeholder="0.00"
        step="0.01"
        min={0}
        autoFocus
        disabled={isDisabled}
        className={cn(
          'relative z-10 [&>div]:transition-all',
          errorMessage && '[&>div]:rounded-b-none'
        )}
        value={
          !activeToken
            ? undefined
            : parseBigIntFieldAmount(amount, activeToken.decimals)
        }
        onChange={(e) => handleValueChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            handleEvaluateError(e.currentTarget.value);
          }
        }}
        suffix={
          <AssetSelector
            activeTokenSymbol={activeToken?.symbol}
            assets={assets}
            isDisabled={isDisabled}
            setActiveToken={setActiveToken}
            unFocusInput={unFocusInput}
          />
        }
      >
        <div className="text-xs font-mono tracking-tighter flex justify-between items-center w-full mt-1">
          <span className="opacity-50">
            ${!usdAmount ? '0' : displayAmount(usdAmount, 2, 2)}
          </span>
          <div className="mt-1">
            {isMounted &&
            accountTokenBalance !== undefined &&
            activeToken?.symbol ? (
              <>
                <span className="opacity-50">
                  Balance:{' '}
                  {displayEthAmount(
                    !address
                      ? '0'
                      : formatUnits(accountTokenBalance, activeToken.decimals)
                  )}{' '}
                  {activeToken.symbol}
                </span>{' '}
                {address && (
                  <button
                    ref={maxButtonRef}
                    onClick={handleMaxBalance}
                    disabled={!estimatedMaxGas}
                    className={twJoin(
                      'text-black font-bold mx-1',
                      'disabled:opacity-50 enabled:hover:opacity-75 enabled:underline'
                    )}
                    onBlur={() => {
                      const restakeInput = document.getElementById(
                        'restake-amount'
                      ) as HTMLInputElement;
                      if (!restakeInput) return;
                      handleEvaluateError(restakeInput?.value ?? '');
                    }}
                  >
                    Max
                  </button>
                )}
              </>
            ) : (
              <Skeleton width={50} />
            )}
          </div>
        </div>
      </InputField>
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

export default StakeField;
