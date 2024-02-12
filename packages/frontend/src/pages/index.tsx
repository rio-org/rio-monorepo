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
        'inline-flex items-center text-sm -tracking-tight',
        'rounded-full border border-[var(--color-light-blue)] text-[var(--color-blue)] py-[6px] px-4 gap-1',
        '[&>span]:inline-block [&>span]:uppercase [&>span]:leading-none cursor-default',
        className
      )}
    >
      {prefix && <span>{prefix}</span>}
      {children ? <span>{children}</span> : <Skeleton width={40} />}
      {suffix && <span>{suffix}</span>}
      {children && infoTooltipContent && (
        <InfoTooltip
          iconClassName="[&>path]:stroke-[blue]"
          contentClassName="max-w-[300px]"
          align="center"
          side={isTouch ? 'bottom' : 'top'}
        >
          {infoTooltipContent}
        </InfoTooltip>
      )}
    </span>
  );
};

export default Home;
