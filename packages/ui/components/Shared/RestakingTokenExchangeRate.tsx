import React, { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Skeleton from 'react-loading-skeleton';
import { motion } from 'framer-motion';
import { twJoin } from 'tailwind-merge';
import { InfoTooltip } from './InfoTooltip';
import { useAssetExchangeRate } from '../../hooks/useAssetExchangeRate';
import { displayAmount } from '../../lib/utilities';
import { DESKTOP_MQ } from '../../lib/constants';
import { TokenSymbol } from '../../lib/typings';
import { IconSwitch } from '../Icons/IconSwitch';
import { DetailBox } from './DetailBox';

export type RestakingTokenExchangeRateProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> & {
  restakingTokenSymbol?: TokenSymbol;
  assetSymbol?: TokenSymbol;
  defaultRateDenominator?: 'restakingToken' | 'asset';
  rateDenominator?: 'restakingToken' | 'asset';
};

export const RestakingTokenExchangeRate = ({
  restakingTokenSymbol,
  assetSymbol,
  defaultRateDenominator = 'asset',
  rateDenominator,
  ...props
}: RestakingTokenExchangeRateProps) => {
  const [isRestakingTokenBase, setRestakingTokenBase] = useState(
    defaultRateDenominator === 'restakingToken'
  );
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  useEffect(() => {
    if (!rateDenominator) return;
    setRestakingTokenBase(rateDenominator === 'restakingToken');
  }, [rateDenominator]);

  const { data: exchangeRate } = useAssetExchangeRate({
    asset: assetSymbol,
    lrt: restakingTokenSymbol
  });

  const handleChange = useCallback(() => {
    setRestakingTokenBase((prev) => !prev);
  }, []);

  const rateDecimals = isDesktopOrLaptop ? [3, 3] : [2, 2];

  return (
    <DetailBox
      {...props}
      title={
        <div className="flex items-center gap-1.5">
          <span className="leading-none">
            {isRestakingTokenBase ? restakingTokenSymbol : assetSymbol} rate
          </span>

          <InfoTooltip
            align="end"
            contentClassName="text-left max-w-[300px] space-y-3 py-3 px-4 leading-none"
          >
            <div className="font-sans text-xs font-bold opacity-30">
              USD Prices
            </div>
            <div className="w-full text-[14px] flex gap-3 justify-between">
              <span className="font-bold">{restakingTokenSymbol}</span>
              <span className="font-mono tracking-tighter opacity-60">
                {!exchangeRate ? (
                  <Skeleton width={40} />
                ) : (
                  `${displayAmount(exchangeRate.usd / exchangeRate.lrt, 2, 2)}`
                )}
              </span>
            </div>
            <div className="w-full text-[14px] flex gap-3 justify-between">
              <span className="font-bold">{assetSymbol}</span>
              <span className="font-mono tracking-tighter opacity-60">
                {!exchangeRate ? (
                  <Skeleton width={40} />
                ) : (
                  `${displayAmount(exchangeRate.usd, 2, 2)}`
                )}
              </span>
            </div>
          </InfoTooltip>

          <motion.button
            transition={{ duration: 0.2 }}
            onClick={handleChange}
            className={twJoin(
              'group flex justify-center items-center flex-shrink-0',
              'w-[16px] min-w-[16px] h-[16px] rounded-[4px] select-none',
              'bg-primaryA2 hover:bg-primaryA3 active:bg-primaryA4',
              'dark:bg-primaryA2 dark:hover:bg-primaryA5 dark:active:bg-primaryA6'
            )}
          >
            <motion.div
              animate={{ rotate: isRestakingTokenBase ? 180 : -180 }}
              transition={{ duration: 0.2 }}
            >
              <IconSwitch
                width={10}
                height={10}
                className={twJoin(
                  'opacity-70 group-hover:opacity-90 group-active:opacity-100',
                  'transition-opacity'
                )}
              />
            </motion.div>
          </motion.button>
        </div>
      }
    >
      <span className="leading-none whitespace-nowrap">
        {!exchangeRate ? (
          <Skeleton className="inline-block" width={160} height={12} />
        ) : isRestakingTokenBase ? (
          <>
            {displayAmount(1 / exchangeRate.lrt, ...rateDecimals)}{' '}
            <span>{assetSymbol}</span>
          </>
        ) : (
          <>
            {displayAmount(exchangeRate.lrt, ...rateDecimals)}{' '}
            <span>{restakingTokenSymbol}</span>
          </>
        )}
      </span>
    </DetailBox>
    // <div
    //   className={cn('flex items-center flex-nowrap gap-2', className)}
    //   {...props}
    // >
    //   {exchangeRate && (
    //     <div className="flex items-center gap-1 text-right">
    //       <span className="text-foreground text-xs font-bold">
    //         {!exchangeRate ? (
    //           <Skeleton className="inline-block" width={160} height={12} />
    //         ) : isRestakingTokenBase ? (
    //           <>
    //             {displayAmount(1, ...rateDecimals)} {restakingTokenSymbol} ={' '}
    //             {displayAmount(1 / exchangeRate.lrt, ...rateDecimals)}{' '}
    //             {assetSymbol}
    //           </>
    //         ) : (
    //           <>
    //             {displayAmount(1, ...rateDecimals)} {assetSymbol} ={' '}
    //             {displayAmount(exchangeRate.lrt, ...rateDecimals)}{' '}
    //             {restakingTokenSymbol}
    //           </>
    //         )}
    //       </span>
    //     </div>
    //   )}

    // </div>
  );
};
