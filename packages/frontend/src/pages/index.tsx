import type { NextPage } from 'next';
import RestakeWrapper from '../components/Restake/RestakeWrapper';
import { useGetNetworkStats } from '../hooks/useGetNetworkStats';
import Skeleton from 'react-loading-skeleton';
import RestakeForm from '../components/Restake/RestakeForm';

const Home: NextPage = () => {
  const { networkStats } = useGetNetworkStats();
  const tvl = networkStats?.tvl ? networkStats.tvl.toLocaleString() + ' ETH' : <Skeleton width={40} />;
  const apr = networkStats?.apr ? networkStats?.apr + '%' : <Skeleton />;

  return (
    <>
      <RestakeWrapper>
        <div className='flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-2xl'>
          <div className='flex justify-between gap-8 w-full px-5 pt-5 pb-3'>
            <h1 className='text-2xl'>Restake</h1>
            <div className='flex gap-2 justify-center items-center'>
              <span className='text-sm uppercase -tracking-tight rounded-full border border-[var(--color-light-blue)] text-[var(--color-blue)] py-[6px] px-4 flex gap-1'>
                TVL: {tvl}
              </span>
              <span className='text-sm uppercase -tracking-tight rounded-full border border-[var(--color-light-blue)] text-[var(--color-blue)] py-[6px] px-4'>
                {apr}
              </span>
            </div>
          </div>
          <div className='bg-white rounded-xl p-6 w-full m-[2px]'>
            <div>
              <RestakeForm />
            </div>
          </div>
        </div>
      </RestakeWrapper>
    </>
  );
};

export default Home;
