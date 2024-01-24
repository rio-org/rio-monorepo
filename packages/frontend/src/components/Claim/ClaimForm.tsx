import { AnimatePresence, motion } from 'framer-motion';
import { LRTDetails } from '@rio-monorepo/ui/lib/typings';
import ClaimHeader from './ClaimHeader';
import ItemizedAsset from '@rio-monorepo/ui/components/Assets/ItemizedAsset';
import { ASSETS } from '@rio-monorepo/ui/lib/constants';
import HR from '@rio-monorepo/ui/components/Shared/HR';
import { useCallback, useEffect } from 'react';
import { useGetAccountWithdrawals } from '@rio-monorepo/ui/hooks/useGetAccountWithdrawals';
import Skeleton from 'react-loading-skeleton';
import {
  ClaimWithdrawalParams,
  useLiquidRestakingToken
} from '@rionetwork/sdk-react';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import TransactionButton from '@rio-monorepo/ui/components/Shared/TransactionButton';
import { useSubgraphConstractWrite } from '@rio-monorepo/ui/hooks/useSubgraphContractWrite';

interface Props {
  lrt: LRTDetails;
}

export const HydratedClaimForm = ({ lrt }: Props) => {
  const lrtClient = useLiquidRestakingToken(lrt.address);
  const { address } = useAccountIfMounted();

  const {
    data: { withdrawalAssets, withdrawalParams } = {
      withdrawalAssets: [{ amount: 0, symbol: 'ETH' }],
      withdrawalParams: [] as ClaimWithdrawalParams[]
    },
    refetch
  } = useGetAccountWithdrawals(
    { where: { sender: address, restakingToken: lrt.address } },
    { enabled: !!address && !!lrt?.address }
  );

  const execute = useCallback(async () => {
    if (!lrtClient || !address || !withdrawalParams) return;

    return withdrawalParams.length !== 1
      ? lrtClient.claimWithdrawalsForManyEpochs(withdrawalParams)
      : lrtClient.claimWithdrawalsForEpoch(withdrawalParams[0]);
  }, [lrtClient, address, withdrawalParams]);

  const onReset = useCallback(async () => {
    return refetch().catch(console.error);
  }, [refetch]);

  const canClaim = !!address && !!lrtClient && withdrawalParams?.length > 0;

  const { txHash, isLoading, error, success, write, reset } =
    useSubgraphConstractWrite({
      execute,
      onReset,
      enabled: canClaim,
      confirmations: 1
    });

  useEffect(() => void (success && onReset()), [success, onReset]);

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

      <TransactionButton
        hash={txHash}
        disabled={!canClaim || isLoading}
        isSigning={isLoading}
        error={error}
        reset={reset}
        clearErrors={reset}
        write={write}
      >
        {isLoading
          ? 'Claiming'
          : canClaim
          ? 'Claim'
          : 'Nothing available to claim'}
      </TransactionButton>
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
