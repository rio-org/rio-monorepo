import React from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import ClaimHeader from '../../components/Claim/ClaimHeader';
import ItemizedAsset from '../../components/Assets/ItemizedAsset';
import { ASSETS } from '../../lib/constants';
import HR from '../../components/Shared/HR';
import ClaimButton from '../../components/Claim/ClaimButton';

const Claim: NextPage = () => {
  return (
    <WithdrawWrapper>
      <div>
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
    </WithdrawWrapper>
  );
};

export default Claim;
