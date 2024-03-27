import { type ClaimWithdrawalParams } from '@rionetwork/sdk-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import { twJoin } from 'tailwind-merge';
import Link from 'next/link';
import {
  type GetStaticProps,
  type InferGetStaticPropsType,
  type NextPage
} from 'next';
import { TestnetBanner } from '@rio-monorepo/ui/components/Shared/TestnetBanner';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import IconLineArrow from '@rio-monorepo/ui/components/Icons/IconLineArrow';
import { Button } from '@rio-monorepo/ui/components/shadcn/button';
import { FAQS } from '@rio-monorepo/ui/components/Shared/FAQs';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { useGetAccountWithdrawals } from '@rio-monorepo/ui/hooks/useGetAccountWithdrawals';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { useHashTabs } from '@rio-monorepo/ui/hooks/useHashTabs';
import { getFAQsFromEdge } from '@rio-monorepo/ui/lib/api';
import { asType, cn } from '@rio-monorepo/ui/lib/utilities';
import { APP_ENV } from '@rio-monorepo/ui/config';
import {
  type FAQ,
  type LRTDetails,
  type InternalAppNavItem,
  AppEnv,
  RestakeFormTab
} from '@rio-monorepo/ui/lib/typings';
import { WithdrawalRequestHistory } from '@/components/History/WithdrawalRequestHistory';
import { RestakeForm } from '@/components/Lazy/RestakeForm.lazy';
import { ClaimSection } from '@/components/Claim/ClaimSection';
import { APP_NAV_ITEMS } from 'config';

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  faqs
}) => {
  const { address } = useAccountIfMounted();
  // When more LRT products are available, we'll offer a way to switch these
  const isMounted = useIsMounted();
  const { data: lrtList } = useGetLiquidRestakingTokens();
  const [activeLrt, setActiveLrt] = useState<LRTDetails | undefined>(
    lrtList?.[0]
  );
  const [tab, setTab] = useHashTabs({
    index: RestakeFormTab.RESTAKE,
    withdraw: RestakeFormTab.WITHDRAW,
    restake: RestakeFormTab.RESTAKE
  });

  useEffect(() => setActiveLrt(lrtList?.[0]), [lrtList]);

  const {
    data: {
      withdrawalRequests: rawRequests,
      withdrawalAssets,
      withdrawalParams
    } = {
      withdrawalAssets: [{ amount: 0, symbol: 'ETH' }],
      withdrawalParams: [] as ClaimWithdrawalParams[]
    },
    isLoading: withdrawalRequestsLoading,
    refetch: refetchWithdrawals
  } = useGetAccountWithdrawals(
    {
      where: {
        sender: address,
        restakingToken: activeLrt?.address,
        isClaimed: false
      }
    },
    {
      enabled: !!address && !!activeLrt?.address,
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 5
    }
  );


  const [withdrawalRequests, requestsLength] = useMemo(() => {
    const requests = rawRequests?.filter((r) => !r.isReadyToClaim);
    const requestsLength = requests?.length ?? 0;
    return [requests, requestsLength];
  }, [rawRequests]);

  const handleRequestSuccess = useCallback(() => {
    setTimeout(() => refetchWithdrawals?.().catch(console.error), 2000);
  }, [refetchWithdrawals]);

  const historySlug = asType<InternalAppNavItem[]>(APP_NAV_ITEMS).find(
    (item) => item.label === 'History'
  )?.slug;

  const isLoading = !isMounted || !activeLrt;
  const networkStats = {
    tvl: !isLoading
      ? `${Math.trunc(activeLrt.totalValueETH ?? 0).toLocaleString()} ETH`
      : null,
    apy: !isLoading ? `${(activeLrt.percentAPY ?? 0).toLocaleString()}%` : null
  };

  return (
    <>
      <PageWrapper className="mb-24">
        <TestnetBanner />
        <div className="w-full space-y-4">
          <RestakeForm
            tab={tab}
            onChangeTab={setTab}
            lrtDetails={activeLrt}
            networkStats={networkStats}
            onWithdrawSuccess={handleRequestSuccess}
          />

          <ClaimSection
            withdrawalAssets={withdrawalAssets}
            withdrawalParams={withdrawalParams}
            refetch={refetchWithdrawals}
            restakingToken={activeLrt}
            isWithdrawalsLoading={withdrawalRequestsLoading}
          />

          <div
            className={cn(
              'w-full bg-background border border-border rounded-[4px] shadow-cardlight opacity-70 transition-opacity',
              !!requestsLength && 'opacity-100'
            )}
          >
            <div
              className={twJoin(
                'w-full flex justify-between items-center gap-4 text-[14px] p-2',
                !!requestsLength && 'border-b border-border'
              )}
            >
              <h3
                className={cn(
                  'flex items-center gap-1 font-bold text-foregroundA8 text-sm pl-2 md:pl-3',
                  !!requestsLength && 'text-foreground'
                )}
              >
                {isLoading ? (
                  <>
                    <Spinner /> <span>Pending requests loading</span>
                  </>
                ) : (
                  <>
                    {requestsLength ? `${requestsLength} P` : 'No p'}
                    ending request{requestsLength !== 1 ? 's' : ''}
                  </>
                )}
              </h3>
              {historySlug && (
                <Button asChild variant="link" size="sm">
                  <Link
                    className="flex items-center gap-1 font-medium opacity-50 hover:opacity-100 transition-opacity"
                    href={historySlug.replace(/\/+/g, '/')}
                  >
                    <span>History</span>
                    <IconLineArrow direction="right" />
                  </Link>
                </Button>
              )}
            </div>

            <AnimatePresence>
              {withdrawalRequests?.length && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="w-full overflow-hidden"
                >
                  <WithdrawalRequestHistory
                    lrt={activeLrt}
                    withdrawalRequests={withdrawalRequests}
                    className="rounded-xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!!faqs.length && <FAQS faqs={faqs} tab={tab} />}
        </div>
      </PageWrapper>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<{ faqs: FAQ[] }> = async () => {
  const faqs = await getFAQsFromEdge('restaking', '/');
  const revalidate = APP_ENV === AppEnv.PRODUCTION ? false : 1;
  return { props: { faqs }, revalidate };
};
