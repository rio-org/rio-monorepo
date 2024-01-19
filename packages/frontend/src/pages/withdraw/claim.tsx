import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { LRTDetails } from '@rio-monorepo/ui/lib/typings';
import { ClaimForm } from '../../components/Claim/ClaimForm';

const Claim: NextPage = () => {
  const { data: lrtList } = useGetLiquidRestakingTokens();
  const [activeLrt, setActiveLrt] = useState<LRTDetails | undefined>(
    lrtList?.[0]
  );

  useEffect(() => {
    setActiveLrt(lrtList?.[0]);
  }, [lrtList]);

  return (
    <WithdrawWrapper>
      <ClaimForm lrt={activeLrt} />
    </WithdrawWrapper>
  );
};

export default Claim;
