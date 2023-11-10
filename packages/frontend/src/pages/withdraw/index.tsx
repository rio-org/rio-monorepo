import React, { useState } from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import WithdrawTabs from '../../components/Withdraw/WithdrawTabs';
import WithdrawField from '../../components/Withdraw/WithdrawField';
import WithdrawAssetSelector from '../../components/Withdraw/WithdrawAssetSelector';
import { TokenSymbol } from '../../lib/typings';

const Withdraw: NextPage = () => {
  const [activeTokenSymbol, setActiveTokenSymbol] = useState<TokenSymbol>('ETH');
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
          <div className="bg-white rounded-xl p-6 w-full m-[2px] flex flex-col gap-4">
            <WithdrawField
              amount={0}
              accountTokenBalance={0}
              activeTokenSymbol={"ETH"}
              setAmount={() => { }}
              setActiveTokenSymbol={() => { }}
            />

            <WithdrawAssetSelector
              activeTokenSymbol={activeTokenSymbol}
              setActiveTokenSymbol={setActiveTokenSymbol}
            />

          </div>
        </div>
      </div>
    </WithdrawWrapper>
  );
};

export default Withdraw;
