import React from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import ClaimHeader from '../../components/Claim/ClaimHeader';
import ItemizedAsset from '../../components/Assets/ItemizedAsset';
import { ASSETS } from '../../lib/constants';
import HR from '../../components/Shared/HR';
import ClaimButton from '../../components/Claim/ClaimButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useAccount } from 'wagmi';

const assetValues = Object.values(ASSETS);

const Claim: NextPage = () => {
  const { address } = useAccount();

  // TODO : Fetch real data
  const demoAmount = 0.0;
  const assets: typeof assetValues = [ASSETS['ETH']];

  return (
    <WithdrawWrapper>
      <div>
        <ClaimHeader
          symbol={assets.length > 1 ? '＊ETH' : 'ETH'}
          amount={address ? demoAmount : 0.0}
        />
        <AnimatePresence>
          {assets.length > 1 && (
            <motion.div
              className="flex flex-col gap-3 mt-4 mb-4"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ duration: 0.2 }}
            >
              <p className="mt-4 text-[14px]">
                <strong>Assets to claim</strong>
              </p>
              <HR />
              {assets.map((asset) => {
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
          )}
        </AnimatePresence>
        <ClaimButton isValid={address && demoAmount > 0 ? true : false} />
      </div>
    </WithdrawWrapper>
  );
};

export default Claim;
