import Skeleton from 'react-loading-skeleton';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import RestakeWrapper from '@/components/Restake/RestakeWrapper';
import { RestakeForm } from '@/components/Restake/RestakeForm';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { type LRTDetails } from '@rio-monorepo/ui/lib/typings';
import { cn } from '@rio-monorepo/ui/lib/utilities';
import {
  InfoTooltip,
  InfoTooltipProps
} from '@rio-monorepo/ui/components/Shared/InfoTooltip';
import { useIsTouch } from '@rio-monorepo/ui/contexts/TouchProvider';
import { AnimatePresence, motion } from 'framer-motion';

const Home: NextPage = () => {
  // When more LRT products are available, we'll offer a way to switch these
  const isMounted = useIsMounted();
  const { data: lrtList } = useGetLiquidRestakingTokens();
  const [activeLrt, setActiveLrt] = useState<LRTDetails | undefined>(
    lrtList?.[0]
  );

  useEffect(() => setActiveLrt(lrtList?.[0]), [lrtList]);

  const isLoading = !isMounted || !activeLrt;
  const networkStats = {
    tvl: !isLoading
      ? `${Math.trunc(activeLrt.totalValueETH ?? 0).toLocaleString()} ETH`
      : null,
    apy: !isLoading ? `${(activeLrt.percentAPY ?? 0).toLocaleString()}%` : null
  };

  return (
    <RestakeWrapper>
      <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-2xl p-1">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-2 lg:gap-8 w-full px-4 lg:px-5 pt-3 lg:pt-5 pb-3">
          <h1 className="text-2xl font-medium">Restake</h1>
          <div className="flex gap-2 lg:justify-center items-center">
            <HeaderBadge
              prefix="TVL:"
              infoTooltipContent={
                <p>
                  The Total Value Locked <strong>(TVL)</strong> represents the
                  total amount of assets underlying the reETH token.
                </p>
              }
            >
              {networkStats.tvl}
            </HeaderBadge>
            <HeaderBadge
              suffix="APY"
              infoTooltipContent={
                <p>
                  Rewards are earned through {activeLrt?.symbol} token value
                  appreciation. The rewards rate is determined by the price of
                  ETH versus the change of the price of {activeLrt?.symbol}.
                </p>
              }
            >
              {networkStats.apy}
            </HeaderBadge>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 lg:p-6 space-y-4 w-full">
          <RestakeForm lrtDetails={activeLrt} />
        </div>
      </div>
    </RestakeWrapper>
  );
};

const HeaderBadge = ({
  children,
  className,
  prefix,
  suffix,
  infoTooltipContent
}: {
  className?: string;
  children?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  infoTooltipContent?: InfoTooltipProps['children'];
}) => {
  const isTouch = useIsTouch();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'text-[var(--color-blue)] text-xs leading-none tracking-tight',
        'py-1.5 px-3.5',
        'rounded-full border border-[var(--color-light-blue)]',
        '[&>span]:inline-block [&>span]:uppercase [&>span]:leading-none [&>span]:font-mono',
        className
      )}
    >
      {prefix && <span>{prefix}</span>}
      {children ? (
        <AnimatePresence>
          <motion.span
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            className="whitespace-nowrap"
          >
            {children}
          </motion.span>
        </AnimatePresence>
      ) : (
        <Skeleton
          width={40}
          containerClassName="!bg-[var(--color-blue)] !bg-opacity-20 rounded-[4px] overflow-hidden"
          className="!opacity-70 after:!opacity-10"
        />
      )}
      {suffix && <span>{suffix}</span>}
      {children && infoTooltipContent && (
        <AnimatePresence>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 12, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-3 inline"
          >
            <InfoTooltip
              iconClassName="[&>path]:stroke-[blue] opacity-60 w-[12px] h-[12px] -translate-y-[1px] ml-0.5"
              contentClassName="max-w-[300px]"
              align="center"
              side={isTouch ? 'bottom' : 'top'}
            >
              {infoTooltipContent}
            </InfoTooltip>
          </motion.div>
        </AnimatePresence>
      )}
    </span>
  );
};

export default Home;
