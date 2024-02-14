import { Spinner } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import {
  type GetStaticProps,
  type InferGetStaticPropsType,
  type NextPage
} from 'next';
import { WithdrawalRequestHistory } from '@/components/History/WithdrawalRequestHistory';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import { FAQS } from '@rio-monorepo/ui/components/Shared/FAQs';
import WithdrawWrapper from '@/components/Withdraw/WithdrawWrapper';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { useGetAccountWithdrawals } from '@rio-monorepo/ui/hooks/useGetAccountWithdrawals';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { AppEnv, type FAQ } from '@rio-monorepo/ui/lib/typings';
import { getFAQsFromEdge } from '@rio-monorepo/ui/lib/api';
import { APP_ENV } from '@rio-monorepo/ui/config';

const History: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  faqs
}) => {
  const { data: lrts } = useGetLiquidRestakingTokens();
  const lrt = lrts?.[0];

  const isMounted = useIsMounted();
  const { address } = useAccountIfMounted();
  const {
    data: { withdrawalRequests },
    isLoading,
    isFetched
  } = useGetAccountWithdrawals(
    { where: { sender: address, restakingToken: lrt?.address } },
    { enabled: !!address && !!lrt?.address }
  );

  return (
    <>
      <WithdrawWrapper noPadding>
        <h2 className="px-4 lg:px-6 pt-4 lg:pt-6 lg:pb-1 text-[14px] font-bold">
          Withdrawal history
        </h2>
        {!!address && (isLoading || !isMounted || !isFetched) ? (
          <motion.div
            className="bg-white w-full flex items-center justify-center border-t border-blue-gray-50 p-4 rounded-xl h-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            layoutId="withdraw-history"
          >
            <Spinner color="blue" />
          </motion.div>
        ) : (
          <>
            {!address && (
              <h2 className="lg:p-6 p-4 lg:pt-6 text-center opacity-50">
                Connect to see your withdraw history
              </h2>
            )}
            {withdrawalRequests && withdrawalRequests.length > 0 ? (
              <WithdrawalRequestHistory
                lrt={lrt}
                withdrawalRequests={withdrawalRequests}
              />
            ) : (
              address && (
                <div className="bg-white shadow rounded-b-xl overflow-hidden border-t border-t-gray-200">
                  <div className="p-4 lg:p-6 text-center opacity-50">
                    No withdraws yet
                  </div>
                </div>
              )
            )}
          </>
        )}
      </WithdrawWrapper>

      {!!faqs.length && (
        <PageWrapper className="mt-4 mb-24">
          <FAQS faqs={faqs} />
        </PageWrapper>
      )}
    </>
  );
};

export default History;

export const getStaticProps: GetStaticProps<{ faqs: FAQ[] }> = async () => {
  const faqs = await getFAQsFromEdge('restaking', '/withdraw/history');
  const revalidate = APP_ENV === AppEnv.PRODUCTION ? false : 1;
  return { props: { faqs }, revalidate };
};
