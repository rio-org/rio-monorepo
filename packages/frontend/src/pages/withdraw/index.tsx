import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import WithdrawForm from '../../components/Withdraw/WithdrawForm';
import { LRTDetails } from '@rio-monorepo/ui/lib/typings';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';

const Withdraw: NextPage = () => {
  const { data: lrtList } = useGetLiquidRestakingTokens();
  const [activeLrt, setActiveLrt] = useState<LRTDetails | undefined>(
    lrtList?.[0]
  );

  useEffect(() => {
    setActiveLrt(lrtList?.[0]);
  }, [lrtList]);

  return (
    <WithdrawWrapper>
      {activeLrt && <WithdrawForm lrt={activeLrt} />}
    </WithdrawWrapper>
  );
};

export default Withdraw;
