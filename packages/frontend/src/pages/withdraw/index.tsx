import { type ClaimWithdrawalParams } from '@rionetwork/sdk-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import Link from 'next/link';
import {
  type InferGetStaticPropsType,
  type GetStaticProps,
  type NextPage
} from 'next';
import { WithdrawalRequestHistory } from '@/components/History/WithdrawalRequestHistory';
import { WithdrawForm } from '@/components/Withdraw/WithdrawForm';
import { ClaimSection } from '@/components/Claim/ClaimSection';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import IconLineArrow from '@rio-monorepo/ui/components/Icons/IconLineArrow';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { FAQS } from '@rio-monorepo/ui/components/Shared/FAQs';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { useGetAccountWithdrawals } from '@rio-monorepo/ui/hooks/useGetAccountWithdrawals';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { getFAQsFromEdge } from '@rio-monorepo/ui/lib/api';
import { asType } from '@rio-monorepo/ui/lib/utilities';
import { APP_ENV } from '@rio-monorepo/ui/config';
import { APP_NAV_ITEMS } from '@/../config';
import {
  AppEnv,
  type InternalAppNavItem,
  type FAQ,
  type LRTDetails
} from '@rio-monorepo/ui/lib/typings';

const Withdraw: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  faqs
}) => {
  const { address } = useAccountIfMounted();
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
    isLoading,
    refetch
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

  const withdrawalRequests = useMemo(
    () => rawRequests?.filter((r) => !r.isReadyToClaim),
    [rawRequests]
  );

  const handleRequestSuccess = useCallback(() => {
    setTimeout(() => refetch?.().catch(console.error), 2000);
  }, [refetch]);

  const requestsLength = withdrawalRequests?.length ?? 0;

  const historySlug = asType<InternalAppNavItem[]>(APP_NAV_ITEMS).find(
    (item) => item.label === 'Rewards'
  )?.slug;

  return (
    <>
      <PageWrapper>
        <div className="flex flex-col items-center justify-center w-full h-full bg-foregroundA1 rounded-2xl p-1">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 w-full px-4 lg:px-5 pt-3 lg:pt-5 pb-3">
            <h1 className="text-2xl font-medium">Request withdrawal</h1>
          </div>
          <div className="bg-background rounded-xl p-4 lg:p-6 space-y-4 w-full">
            <WithdrawForm
              lrtDetails={activeLrt}
              onSuccess={handleRequestSuccess}
            />
          </div>
        </div>
      </PageWrapper>

      <ClaimSection
        withdrawalAssets={withdrawalAssets}
        withdrawalParams={withdrawalParams}
        refetch={refetch}
        restakingToken={activeLrt}
        isWithdrawalsLoading={isLoading}
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

      {!!faqs.length && (
        <PageWrapper className="mt-4 mb-24">
          <FAQS faqs={faqs} />
        </PageWrapper>
      )}
    </>
  );
};

export default Withdraw;

export const getStaticProps: GetStaticProps<{ faqs: FAQ[] }> = async () => {
  const faqs = await getFAQsFromEdge('restaking', '/withdraw');
  const revalidate = APP_ENV === AppEnv.PRODUCTION ? false : 1;
  return { props: { faqs }, revalidate };
};
