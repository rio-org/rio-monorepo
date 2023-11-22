import React from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import ClaimHeader from '../../components/Claim/ClaimHeader';
import ItemizedAsset from '../../components/Assets/ItemizedAsset';
import { ASSETS } from '../../lib/constants';
import HR from '../../components/Shared/HR';
import ClaimButton from '../../components/Claim/ClaimButton';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';

const Claim: NextPage = () => {
  const { address } = useAccount();
  const demoAmount = 12.83;
  return (
    <WithdrawWrapper>
      <div>
        <ClaimHeader amount={address ? demoAmount : 0.0} />
        <p className="mt-4 text-[14px]">
          <strong>Assets to claim</strong>
        </p>
        <HR />
        <motion.div
          className="flex flex-col gap-3 mt-4 mb-4"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {Object.values(ASSETS).map((asset) => {
            if (asset.symbol === '＊ETH') return null;
            return (
              <ItemizedAsset
                key={asset.symbol}
                asset={asset}
                isActiveToken={false}
                isLoading={false}
                isError={false}
                amount={address ? demoAmount / 6 : 0.0}
              />
            );
          })}
        </motion.div>
        <ClaimButton isValid={address ? true : false} />
      </div>
    </WithdrawWrapper>
  );
};

export default Claim;
