import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import WithdrawForm from '../../components/Withdraw/WithdrawForm';
import { LRTDetails } from '../../lib/typings';
import { useGetLiquidRestakingTokens } from '../../hooks/useGetLiquidRestakingTokens';

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
