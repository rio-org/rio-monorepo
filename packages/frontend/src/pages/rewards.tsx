import React from 'react';
import type { NextPage } from 'next';
import Stats from '../components/Rewards/Stats';
import TransactionHistoryTable from '../components/Rewards/TransactionHistoryTable';

const Rewards: NextPage = () => {
  return (
    <>
      <Stats />
      <TransactionHistoryTable />
    </>
  );
};

export default Rewards;
