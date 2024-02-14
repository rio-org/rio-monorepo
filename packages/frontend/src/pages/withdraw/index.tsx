import { useEffect, useState } from 'react';
import {
  type GetStaticProps,
  type InferGetStaticPropsType,
  type NextPage
} from 'next';
import WithdrawWrapper from '@/components/Withdraw/WithdrawWrapper';
import { WithdrawForm } from '@/components/Withdraw/WithdrawForm';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import { FAQS } from '@rio-monorepo/ui/components/Shared/FAQs';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { getFAQsFromEdge } from '@rio-monorepo/ui/lib/api';
import { APP_ENV } from '@rio-monorepo/ui/config';
import {
  AppEnv,
  type FAQ,
  type LRTDetails
} from '@rio-monorepo/ui/lib/typings';

const Withdraw: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  faqs
}) => {
  const { data: lrtList } = useGetLiquidRestakingTokens();
  const [activeLrt, setActiveLrt] = useState<LRTDetails | undefined>(
    lrtList?.[0]
  );

  useEffect(() => setActiveLrt(lrtList?.[0]), [lrtList]);

  return (
    <>
      <WithdrawWrapper>
        <WithdrawForm lrtDetails={activeLrt} />
      </WithdrawWrapper>

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
