import type { NextPage } from 'next';
import RestakeWrapper from '../components/Restake/RestakeWrapper';
import Skeleton from 'react-loading-skeleton';
import RestakeForm from '../components/Restake/RestakeForm';
import { LRTDetails } from '@rio-monorepo/ui/lib/typings';
import { Tooltip } from '@material-tailwind/react';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { useEffect, useState } from 'react';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';

const Home: NextPage = () => {
  const isMounted = useIsMounted();
  // When more LRT products are available, we'll offer a way to switch these
  const { data: lrtList } = useGetLiquidRestakingTokens();
  const [activeLrt, setActiveLrt] = useState<LRTDetails | undefined>(
    lrtList?.[0]
  );

  useEffect(() => {
    if (!lrtList?.length || activeLrt) return;
    setActiveLrt(lrtList[0]);
  }, [lrtList]);

  const networkStats = {
    tvl: activeLrt ? Math.trunc(activeLrt.totalValueETH ?? 0) : null,
    apy: activeLrt ? activeLrt.percentAPY : null
  };

  const [tvlVal, apyVal] =
    isMounted && networkStats
      ? [
          (networkStats.tvl ?? 0).toLocaleString() + ' ETH',
          networkStats.apy ?? 0
        ]
      : [<Skeleton width={40} />, <Skeleton />];

  // TODO: Replace the tooltip content with real copy
  const tooltipContent = (
    <>
      <p>APY information TKTK</p>
    </>
  );

  return (
    <RestakeWrapper>
      <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-2xl p-[2px]">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-2 lg:gap-8 w-full px-4 lg:px-5 pt-3 lg:pt-5 pb-3">
          <h1 className="text-2xl font-medium">Restake</h1>
          <div className="flex gap-2 lg:justify-center items-center">
            <span className="text-sm uppercase -tracking-tight rounded-full border border-[var(--color-light-blue)] text-[var(--color-blue)] py-[6px] px-4 flex gap-1">
              TVL: {tvlVal}
            </span>
            <Tooltip content={tooltipContent}>
              <a
                href="TODO" // TODO: add link to public view of APY details
                target="_blank"
                rel="noreferrer"
                className="text-sm uppercase -tracking-tight rounded-full border border-[var(--color-light-blue)] text-[var(--color-blue)] py-[6px] px-4"
              >
                {apyVal}% APY
              </a>
            </Tooltip>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 lg:p-6 space-y-4 w-full m-[2px]">
          {activeLrt && <RestakeForm lrt={activeLrt} />}
        </div>
      </div>
    </RestakeWrapper>
  );
};

export default Home;
