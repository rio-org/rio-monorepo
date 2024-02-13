import React from 'react';
import type { NextPage } from 'next';
import Stats from '@/components/Rewards/Stats';
import TransactionHistoryTable from '@/components/Rewards/TransactionHistoryTable';
import { PageWrapper } from '@rio-monorepo/ui/components/Shared/PageWrapper';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';

const Rewards: NextPage = () => {
  const { data: lrtList } = useGetLiquidRestakingTokens();
  const activeLrt = lrtList?.[0];
  return (
    <PageWrapper isWide={true}>
      <Stats lrt={activeLrt} />
      <TransactionHistoryTable lrt={activeLrt} />
    </PageWrapper>
  );
};

export default Rewards;
