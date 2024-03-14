import React from 'react';
import {
  type GetStaticProps,
  type InferGetStaticPropsType,
  type NextPage
} from 'next';
import Stats from '@/components/Rewards/Stats';
import TransactionHistoryTable from '@/components/Rewards/TransactionHistoryTable';
import { TestnetBanner } from '@rio-monorepo/ui/components/Shared/TestnetBanner';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import { FAQS } from '@rio-monorepo/ui/components/Shared/FAQs';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { getFAQsFromEdge } from '@rio-monorepo/ui/lib/api';
import { APP_ENV } from '@rio-monorepo/ui/config';
import { AppEnv, type FAQ } from '@rio-monorepo/ui/lib/typings';
import { AnimatePresence, motion } from 'framer-motion';

const History: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  faqs
}) => {
  const { data: lrtList } = useGetLiquidRestakingTokens();
  const activeLrt = lrtList?.[0];
  return (
    <>
      <PageWrapper isWide={true}>
        <TestnetBanner />
        <Stats lrt={activeLrt} />
        <TransactionHistoryTable lrt={activeLrt} />
      </PageWrapper>

      <AnimatePresence>
        {!!faqs.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full mt-8"
          >
            <PageWrapper className="mb-24" isWide>
              <FAQS faqs={faqs} />
            </PageWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default History;

export const getStaticProps: GetStaticProps<{ faqs: FAQ[] }> = async () => {
  const faqs = await getFAQsFromEdge('restaking', '/rewards');
  const revalidate = APP_ENV === AppEnv.PRODUCTION ? false : 1;
  return { props: { faqs }, revalidate };
};
