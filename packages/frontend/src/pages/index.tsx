import { useEffect, useState } from 'react';
import { get } from '@vercel/edge-config';
import type {
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage
} from 'next';
import { InfoBadge } from '@rio-monorepo/ui/components/Shared/InfoBadge';
import { FAQS } from '@rio-monorepo/ui/components/Shared/FAQs';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import { RestakeForm } from '@/components/Restake/RestakeForm';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { FAQS_VERCEL_STORE_KEY } from '@rio-monorepo/ui/lib/constants';
import { APP_ENV } from '@rio-monorepo/ui/config';
import {
  type FAQsEdgeStore,
  type FAQ,
  type LRTDetails,
  AppEnv
} from '@rio-monorepo/ui/lib/typings';

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  faqs
}) => {
  // When more LRT products are available, we'll offer a way to switch these
  const isMounted = useIsMounted();
  const { data: lrtList } = useGetLiquidRestakingTokens();
  const [activeLrt, setActiveLrt] = useState<LRTDetails | undefined>(
    lrtList?.[0]
  );

  useEffect(() => setActiveLrt(lrtList?.[0]), [lrtList]);

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
        <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-2xl p-1">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-2 lg:gap-8 w-full px-4 lg:px-5 pt-3 lg:pt-5 pb-3">
            <h1 className="text-2xl font-medium">Restake</h1>
            <div className="flex gap-2 lg:justify-center items-center">
              <InfoBadge
                prefix="TVL:"
                infoTooltipContent={
                  <p>
                    The Total Value Locked <strong>(TVL)</strong> represents the
                    total amount of assets underlying the reETH token.
                  </p>
                }
              >
                {networkStats.tvl}
              </InfoBadge>
              <InfoBadge
                suffix="APY"
                infoTooltipContent={
                  <p>
                    Rewards are earned through {activeLrt?.symbol} token value
                    appreciation. The rewards rate is determined by the price of
                    ETH versus the change of the price of {activeLrt?.symbol}.
                  </p>
                }
              >
                {networkStats.apy}
              </InfoBadge>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 lg:p-6 space-y-4 w-full">
            <RestakeForm lrtDetails={activeLrt} />
          </div>
        </div>
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

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ faqs: FAQ[] }>
> {
  const faqs = await get<FAQsEdgeStore>(FAQS_VERCEL_STORE_KEY);
  return {
    props: { faqs: faqs?.restaking?.['/'] ?? [] },
    revalidate: APP_ENV === AppEnv.PRODUCTION ? false : 1
  };
}
