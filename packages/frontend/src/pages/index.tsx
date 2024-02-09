import Skeleton from 'react-loading-skeleton';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import RestakeWrapper from '@/components/Restake/RestakeWrapper';
import { RestakeForm } from '@/components/Restake/RestakeForm';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { type LRTDetails } from '@rio-monorepo/ui/lib/typings';
import { cn } from '@rio-monorepo/ui/lib/utilities';

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
            <HeaderBadge prefix="TVL:">
              {networkStats.tvl ?? <Skeleton width={40} />}
            </HeaderBadge>
            <HeaderBadge suffix="APY">
              {networkStats.apy ?? <Skeleton width={40} />}
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
  suffix
}: {
  className?: string;
  children?: React.ReactNode;
  prefix?: string;
  suffix?: string;
}) => (
  <span
    className={cn(
      'inline-flex items-center text-sm uppercase -tracking-tight',
      'rounded-full border border-[var(--color-light-blue)] text-[var(--color-blue)] py-[6px] px-4 gap-1',
      '[&>span]:inline-block cursor-default',
      className
    )}
  >
    {prefix && <span>{prefix}</span>}
    {children}
    {suffix && <span>{suffix}</span>}
  </span>
);

export default Home;
