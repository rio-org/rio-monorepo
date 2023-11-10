import React from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import WithdrawTabs from '../../components/Withdraw/WithdrawTabs';

const History: NextPage = () => {
  return (
    <WithdrawWrapper>
      <div>
        <h1 className="text-2xl">Withdraw</h1>
        <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-2xl">
          <div className="flex justify-between gap-8 w-full px-5 pt-5 pb-3">
            <div className="flex gap-2 justify-center items-center">
              <WithdrawTabs />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 w-full m-[2px]">
            <p>History</p>
          </div>
        </div>
      </div>
    </WithdrawWrapper>
  );
};

export default History;
