import { useEffect, useState } from 'react';
import { get } from '@vercel/edge-config';
import type {
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage
} from 'next';
import WithdrawWrapper from '@/components/Withdraw/WithdrawWrapper';
import { ClaimForm } from '@/components/Claim/ClaimForm';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import { FAQS } from '@rio-monorepo/ui/components/Shared/FAQs';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { FAQS_VERCEL_STORE_KEY } from '@rio-monorepo/ui/lib/constants';
import { APP_ENV } from '@rio-monorepo/ui/config';
import {
  AppEnv,
  type FAQ,
  type FAQsEdgeStore,
  type LRTDetails
} from '@rio-monorepo/ui/lib/typings';

const Claim: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
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
        <ClaimForm lrt={activeLrt} />
      </WithdrawWrapper>

      {!!faqs.length && (
        <PageWrapper className="mt-4 mb-24">
          <FAQS faqs={faqs} />
        </PageWrapper>
      )}
    </>
  );
};

export default Claim;

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ faqs: FAQ[] }>
> {
  const faqs = await get<FAQsEdgeStore>(FAQS_VERCEL_STORE_KEY);
  return {
    props: { faqs: faqs?.restaking?.['/withdraw/claim'] ?? [] },
    revalidate: APP_ENV === AppEnv.PRODUCTION ? false : 1
  };
}
