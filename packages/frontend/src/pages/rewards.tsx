import React from 'react';
import type { NextPage } from 'next';
import Stats from '@/components/Rewards/Stats';
import TransactionHistoryTable from '@/components/Rewards/TransactionHistoryTable';
import RestakeWrapper from '@/components/Restake/RestakeWrapper';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';

const Rewards: NextPage = () => {
  const { data: lrtList } = useGetLiquidRestakingTokens();
  const activeLrt = lrtList?.[0];
  return (
    <RestakeWrapper isWide={true}>
      <Stats lrt={activeLrt} />
      <TransactionHistoryTable lrt={activeLrt} />
    </RestakeWrapper>
  );
};

export default Rewards;
