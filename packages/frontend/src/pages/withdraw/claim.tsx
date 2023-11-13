import React from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import WithdrawTabs from '../../components/Withdraw/WithdrawTabs';
import ClaimHeader from '../../components/Claim/ClaimHeader';
import ItemizedAsset from '../../components/Assets/ItemizedAsset';
import { ASSETS } from '../../lib/constants';
import HR from '../../components/Shared/HR';
import ClaimButton from '../../components/Claim/ClaimButton';

const Claim: NextPage = () => {
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
            <ClaimHeader />
            <p className="mt-4 text-[14px]">
              <strong>Assets to claim</strong>
            </p>
            <HR />
            <div className="flex flex-col gap-3 mt-4 mb-4">
              {Object.values(ASSETS).map((asset) => {
                if (asset.symbol === '＊ETH') return null;
                return (
                  <ItemizedAsset
                    key={asset.symbol}
                    asset={asset}
                    isActiveToken={false}
                    isLoading={false}
                    isError={false}
                    amount={'0.00'}
                  />
                );
              })}
            </div>
            <ClaimButton isValid={false} />
          </div>
        </div>
      </div>
    </WithdrawWrapper>
  );
};

export default Claim;
