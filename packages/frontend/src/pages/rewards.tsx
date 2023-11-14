import React from 'react';
import type { NextPage } from 'next';
import Stats from '../components/Rewards/Stats';
import TransactionHistoryTable from '../components/Rewards/TransactionHistoryTable';
import RestakeWrapper from '../components/Restake/RestakeWrapper';

const Rewards: NextPage = () => {
  return (
    <RestakeWrapper isWide={true}>
      <Stats />
      <TransactionHistoryTable />
    </RestakeWrapper>
  );
};

export default Rewards;
