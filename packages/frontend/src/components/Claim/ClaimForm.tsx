import { AnimatePresence, motion } from 'framer-motion';
import { LRTDetails, TokenSymbol } from '@rio-monorepo/ui/lib/typings';
import ClaimHeader from './ClaimHeader';
import ItemizedAsset from '@rio-monorepo/ui/components/Assets/ItemizedAsset';
import ClaimButton from './ClaimButton';
import { useAccount } from 'wagmi';
import { ASSETS } from '@rio-monorepo/ui/lib/constants';
import HR from '@rio-monorepo/ui/components/Shared/HR';
import { useCallback } from 'react';
import { useGetAccountWithdrawals } from '@rio-monorepo/ui/hooks/useGetAccountWithdrawals';
import Skeleton from 'react-loading-skeleton';

interface Props {
  lrt: LRTDetails;
}

export const HydratedClaimForm = ({ lrt }: Props) => {
  const { address } = useAccount();

  const { data, refetch } = useGetAccountWithdrawals(
    { where: { sender: address, restakingToken: lrt?.address } },
    { enabled: !!address && !!lrt?.address }
  );
  const { withdrawalAssets, withdrawalParams } = data || {
    withdrawalAssets: [] as { symbol: TokenSymbol; amount: number }[]
  };

  const onSuccess = useCallback(() => {
    refetch().catch(console.error);
  }, [refetch]);

  return (
    <div>
      <ClaimHeader
        symbol={
          withdrawalAssets.length > 1 ? '＊ETH' : withdrawalAssets[0]?.symbol
        }
        amount={withdrawalAssets.reduce((a, b) => a + b.amount, 0)}
      />
      <AnimatePresence>
        {withdrawalAssets.length > 1 && (
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
            {withdrawalAssets.map((asset) => {
              return (
                <ItemizedAsset
                  key={asset.symbol}
                  asset={ASSETS[asset.symbol]}
                  isActiveToken={false}
                  isLoading={false}
                  isError={false}
                  amount={asset.amount}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <ClaimButton
        lrt={lrt}
        claimWithdrawalParams={withdrawalParams || []}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export const ClaimForm = ({ lrt }: Partial<Props>) => {
  if (!lrt) {
    return (
      <div>
        <ClaimHeader />
        <motion.button className="rounded-full w-full py-3 mt-4 font-bold bg-black duration-200 bg-opacity-20">
          <Skeleton height="1rem" width={100} className="opacity-30" />
        </motion.button>
      </div>
    );
  }
  return <HydratedClaimForm lrt={lrt} />;
};
