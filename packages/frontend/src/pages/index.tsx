import type { NextPage } from 'next';
import RestakeWrapper from '../components/Restake/RestakeWrapper';
import { useGetNetworkStats } from '../hooks/useGetNetworkStats';
import Skeleton from 'react-loading-skeleton';
import RestakeForm from '../components/Rewards/RestakeForm';
import { useState, useEffect } from 'react';

const Home: NextPage = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { networkStats } = useGetNetworkStats();
  const tvl = networkStats?.tvl ? (
    networkStats.tvl.toLocaleString() + ' ETH'
  ) : (
    <Skeleton width={40} />
  );
  const apr = networkStats?.apr ? networkStats?.apr + '%' : <Skeleton />;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <RestakeWrapper>
      <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-2xl p-[2px]">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-2 lg:gap-8 w-full px-4 lg:px-5 pt-3 lg:pt-5 pb-3">
          <h1 className="text-2xl font-medium">Restake</h1>
          <div className="flex gap-2 lg:justify-center items-center">
            {hasMounted && (
              <>
                <span className="text-sm uppercase -tracking-tight rounded-full border border-[var(--color-light-blue)] text-[var(--color-blue)] py-[6px] px-4 flex gap-1">
                  TVL: {tvl}
                </span>
                <span className="text-sm uppercase -tracking-tight rounded-full border border-[var(--color-light-blue)] text-[var(--color-blue)] py-[6px] px-4">
                  {apr}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 lg:p-6 w-full m-[2px]">
          <RestakeForm />
        </div>
      </div>
    </RestakeWrapper>
  );
};

export default Home;
