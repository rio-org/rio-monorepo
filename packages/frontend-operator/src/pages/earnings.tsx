import { useMemo } from 'react';
import type { NextPage } from 'next';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { ClaimEarningsForm } from '@/components/Earnings/ClaimEarningsForm';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useGetOperators } from '@rio-monorepo/ui/hooks/useGetOperators';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import { TestnetBanner } from '@rio-monorepo/ui/components/Shared/TestnetBanner';

const EarningsPage: NextPage = () => {
  const { address } = useAccountIfMounted();
  const { data: lrts } = useGetLiquidRestakingTokens();
  const activeLrt = useMemo(
    () => lrts?.find((lrt) => lrt?.symbol === 'reETH'),
    [lrts]
  );

  const manager = address?.toLowerCase();
  const { data: operators } = useGetOperators(
    { where: { or: [{ manager }, { earningsReceiver: manager }] } },
    { enabled: !!address }
  );

  const operator = operators?.[0];

  return (
    <PageWrapper>
      <TestnetBanner />
      <div className="w-full flex flex-col gap-4 justify-center items-start">
        <FormCard.Container title="Claim Earnings">
          <ClaimEarningsForm lrt={activeLrt} />
        </FormCard.Container>
        <FormCard.Container header="History">
          <div className="mx-auto py-8 text-center">
            <span className="opacity-50">
              {address
                ? operator
                  ? 'No earnings history yet.'
                  : 'Must be an operator to view earnings history.'
                : 'Connect to view earnings history.'}
            </span>
          </div>
        </FormCard.Container>
      </div>
    </PageWrapper>
  );
};

export default EarningsPage;
