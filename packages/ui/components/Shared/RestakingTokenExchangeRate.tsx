import React, { useCallback, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Skeleton from 'react-loading-skeleton';
import { motion } from 'framer-motion';
import { twJoin } from 'tailwind-merge';
import Image from 'next/image';
import { InfoTooltip } from './InfoTooltip';
import { useAssetExchangeRate } from '../../hooks/useAssetExchangeRate';
import iconTransaction from '../../assets/icon-transaction.svg';
import { cn, displayAmount } from '../../lib/utilities';
import { DESKTOP_MQ } from '../../lib/constants';
import { TokenSymbol } from '../../lib/typings';

export type RestakingTokenExchangeRateProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> & {
  restakingTokenSymbol?: TokenSymbol;
  assetSymbol?: TokenSymbol;
  defaultRateDenominator?: 'restakingToken' | 'asset';
};

export const RestakingTokenExchangeRate = ({
  restakingTokenSymbol,
  assetSymbol,
  className,
  defaultRateDenominator = 'asset',
  ...props
}: RestakingTokenExchangeRateProps) => {
  const [isRestakingTokenBase, setRestakingTokenBase] = useState(
    defaultRateDenominator === 'restakingToken'
  );
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  const { data: exchangeRate } = useAssetExchangeRate({
    asset: assetSymbol,
    lrt: restakingTokenSymbol
  });

  const handleChange = useCallback(() => {
    setRestakingTokenBase((prev) => !prev);
  }, []);

  const rateDecimals = isDesktopOrLaptop ? [3, 3] : [2, 2];

  return (
    <div
      className={cn('flex items-center flex-nowrap gap-2', className)}
      {...props}
    >
      {exchangeRate && (
        <div className="flex items-center gap-1 text-right">
          <span className="text-black text-xs font-bold">
            {!exchangeRate ? (
              <Skeleton className="inline-block" width={160} height={12} />
            ) : isRestakingTokenBase ? (
              <>
                {displayAmount(1, ...rateDecimals)} {restakingTokenSymbol} ={' '}
                {displayAmount(1 / exchangeRate.lrt, ...rateDecimals)}{' '}
                {assetSymbol}
              </>
            ) : (
              <>
                {displayAmount(1, ...rateDecimals)} {assetSymbol} ={' '}
                {displayAmount(exchangeRate.lrt, ...rateDecimals)}{' '}
                {restakingTokenSymbol}
              </>
            )}
          </span>
          <InfoTooltip
            align="end"
            contentClassName="text-left max-w-[300px] space-y-3 py-3 px-4 leading-none"
          >
            <div className="text-xs font-bold opacity-30">USD Prices</div>
            <div className="w-full text-[14px] flex gap-3 justify-between">
              <span className="font-bold">{restakingTokenSymbol}</span>
              <span className="opacity-80">
                ${displayAmount(exchangeRate.usd / exchangeRate.lrt, 2, 2)}
              </span>
            </div>
            <div className="w-full text-[14px] flex gap-3 justify-between">
              <span className="font-bold">{assetSymbol}</span>
              <span className="opacity-80">
                ${displayAmount(exchangeRate.usd, 2, 2)}
              </span>
            </div>
          </InfoTooltip>
        </div>
      )}
      <motion.button
        transition={{ duration: 0.2 }}
        onClick={handleChange}
        className={twJoin(
          'group flex justify-center items-center flex-shrink-0',
          'w-6 min-w-6 h-6 rounded-[4px] select-none',
          'bg-blackA1 hover:bg-blackA3 active:bg-blackA4'
        )}
      >
        <motion.div
          animate={{ rotate: isRestakingTokenBase ? 180 : -180 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src={iconTransaction}
            width={10}
            height={10}
            alt="swap"
            className={twJoin(
              'opacity-25 group-hover:opacity-50 group-active:opacity-70',
              'transition-opacity'
            )}
          />
        </motion.div>
      </motion.button>
    </div>
  );
};
