import { useMemo } from 'react';
import type { NextPage } from 'next';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { ClaimEarningsForm } from '@/components/Earnings/ClaimEarningsForm';
import FormCard from '@rio-monorepo/ui/components/Shared/FormCard';

const EarningsPage: NextPage = () => {
  const { data: lrts } = useGetLiquidRestakingTokens();
  const activeLrt = useMemo(
    () => lrts?.find((lrt) => lrt?.symbol === 'reETH'),
    [lrts]
  );

  return (
    <div className="w-full flex flex-col gap-4 justify-center items-start">
      <FormCard.Container title="Claim Earnings">
        <ClaimEarningsForm lrt={activeLrt} />
      </FormCard.Container>
      <FormCard.Container header="History">
        <div />
      </FormCard.Container>
    </div>
  );
};

export default EarningsPage;
