import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type GetStaticProps,
  type InferGetStaticPropsType,
  type NextPage
} from 'next';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import { FAQS } from '@rio-monorepo/ui/components/Shared/FAQs';
import { RestakeForm } from '@/components/Restake/RestakeForm';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { getFAQsFromEdge } from '@rio-monorepo/ui/lib/api';
import { APP_ENV } from '@rio-monorepo/ui/config';
import {
  type FAQ,
  type LRTDetails,
  type InternalAppNavItem,
  AppEnv
} from '@rio-monorepo/ui/lib/typings';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useGetAccountWithdrawals } from '@rio-monorepo/ui/hooks/useGetAccountWithdrawals';
import { asType } from '@rio-monorepo/ui/lib/utilities';
import { APP_NAV_ITEMS } from 'config';
import { ClaimSection } from '@/components/Claim/ClaimSection';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { Spinner } from '@material-tailwind/react';
import Link from 'next/link';
import IconLineArrow from '@rio-monorepo/ui/components/Icons/IconLineArrow';
import { AnimatePresence, motion } from 'framer-motion';
import { WithdrawalRequestHistory } from '@/components/History/WithdrawalRequestHistory';
import { ClaimWithdrawalParams } from '@rionetwork/sdk-react';

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
    (item) => item.label === 'Rewards'
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
      <PageWrapper>
        <RestakeForm
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

        <FormCard.Wrapper
          header={
            <div className="w-full flex justify-between items-center gap-4 text-[14px]">
              <h3 className="flex items-center gap-1 opacity-70 font-medium">
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
                <Link
                  className="flex items-center gap-1 font-medium opacity-50 hover:opacity-100 transition-opacity"
                  href={historySlug.replace(/\/+/g, '/')}
                >
                  <span>History</span>
                  <IconLineArrow direction="right" />
                </Link>
              )}
            </div>
          }
          className="mt-4"
        >
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
        </FormCard.Wrapper>
      </PageWrapper>
      {!!faqs.length && (
        <PageWrapper className="mt-4 mb-24">
          <FAQS faqs={faqs} />
        </PageWrapper>
      )}
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<{ faqs: FAQ[] }> = async () => {
  const faqs = await getFAQsFromEdge('restaking', '/');
  const revalidate = APP_ENV === AppEnv.PRODUCTION ? false : 1;
  return { props: { faqs }, revalidate };
};
