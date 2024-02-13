import React, { useCallback, useMemo, useRef } from 'react';
import AssetSelector from './AssetSelector';
import Skeleton from 'react-loading-skeleton';
import { formatUnits, parseUnits } from 'viem';
import { useAssetExchangeRate } from '@rio-monorepo/ui/hooks/useAssetExchangeRate';
import InputField from '@rio-monorepo/ui/components/Shared/InputField';
import { AssetDetails, LRTDetails } from '@rio-monorepo/ui/lib/typings';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import {
  displayEthAmount,
  parseBigIntFieldAmount
} from '@rio-monorepo/ui/lib/utilities';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';

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
  const { address } = useAccountIfMounted();
  const isMounted = useIsMounted();
  const { data: exchangeRate } = useAssetExchangeRate({
    asset: activeToken?.address,
    lrt
  });

  const usdAmount = useMemo(() => {
    if (!activeToken || !exchangeRate?.usd) return 0;
    return amount
      ? +formatUnits(amount, activeToken.decimals) * exchangeRate.usd
      : 0;
  }, [amount, activeToken?.decimals, exchangeRate?.usd]);

  const handleValueChange = (value: string) => {
    if (!activeToken || value === '') return setAmount(null);
    setAmount(parseUnits(value, activeToken?.decimals));
  };
  const handleMaxBalance = (balanceAmount: bigint) => {
    const maxBalance = balanceAmount - (estimatedMaxGas ?? 0n);
    setAmount(maxBalance > 0n ? maxBalance : 0n);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const unFocusInput = useCallback(() => {
    if (assets.length <= 1) return;
    inputRef.current?.blur();
  }, [inputRef, assets]);

  return (
    <InputField
      ref={inputRef}
      title="Amount"
      id="amount"
      type="number"
      placeholder="0.00"
      step="0.01"
      min={0}
      autoFocus
      disabled={isDisabled}
      value={
        !activeToken
          ? undefined
          : parseBigIntFieldAmount(amount, activeToken.decimals)
      }
      onChange={(e) => {
        handleValueChange(e.target.value);
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
        <span className="opacity-50">${usdAmount.toLocaleString()}</span>
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
                  className="text-black font-bold underline mx-1 hover:opacity-75"
                  onClick={() => handleMaxBalance(accountTokenBalance)}
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
  );
};

export default StakeField;
