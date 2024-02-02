import { useMemo } from 'react';
import type { NextPage } from 'next';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { ClaimEarningsForm } from '@/components/Earnings/ClaimEarningsForm';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { useGetOperators } from '@rio-monorepo/ui/hooks/useGetOperators';

const EarningsPage: NextPage = () => {
  const { address } = useAccountIfMounted();
  const { data: lrts } = useGetLiquidRestakingTokens();
  const activeLrt = useMemo(
    () => lrts?.find((lrt) => lrt?.symbol === 'reETH'),
    [lrts]
  );

  const { data: operators } = useGetOperators(
    { where: { manager: address?.toLowerCase() } },
    { enabled: !!address }
  );

  const operator = operators?.[0];

  return (
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
                : 'Must be an operator manager to view earnings history.'
              : 'Connect to view earnings history.'}
          </span>
        </div>
      </FormCard.Container>
    </div>
  );
};

export default EarningsPage;
