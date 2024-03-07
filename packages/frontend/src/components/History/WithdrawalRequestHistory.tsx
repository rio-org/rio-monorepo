import { AnimatePresence, motion } from 'framer-motion';
import { LRTDetails } from '@rio-monorepo/ui/lib/typings';
import WithdrawalRequestRow from './WithdrawalRequestRow';
import {
  // RioLRTCoordinatorABI,
  // useLiquidRestakingToken,
  WithdrawalRequest
} from '@rionetwork/sdk-react';
// import { useReadContracts } from 'wagmi';
// import { Address, zeroAddress } from 'viem';
// import { useEffect, useMemo } from 'react';
import {
  // asType,
  // isUndefined,
  cn
} from '@rio-monorepo/ui/lib/utilities';

export const WithdrawalRequestHistory = ({
  withdrawalRequests,
  lrt,
  className
}: {
  withdrawalRequests: WithdrawalRequest[];
  lrt?: LRTDetails;
  className?: string;
}) => {
  if (!lrt)
    return (
      <WithdrawalRequestHistoryWithoutLRT
        withdrawalRequests={withdrawalRequests}
        className={className}
      />
    );
  return (
    <WithdrawalRequestHistoryWithLRT
      withdrawalRequests={withdrawalRequests}
      className={className}
      lrt={lrt}
    />
  );
};

function WithdrawalRequestHistoryWithoutLRT({
  withdrawalRequests,
  className
}: {
  withdrawalRequests: WithdrawalRequest[];
  className?: string;
}) {
  return (
    <WithdrawalRequestHistoryInternal
      withdrawalRequests={withdrawalRequests}
      className={className}
    />
  );
}

function WithdrawalRequestHistoryWithLRT({
  // lrt,
  withdrawalRequests,
  className
}: {
  lrt: LRTDetails;
  withdrawalRequests: WithdrawalRequest[];
  className?: string;
}) {
  // const restakingToken = useLiquidRestakingToken(lrt.address);
  // const coordinatorAddress = restakingToken?.token?.deployment
  //   ?.coordinator as Address;

  // const { data, refetch } = useReadContracts({
  //   contracts: [
  //     {
  //       abi: RioLRTCoordinatorABI,
  //       address: coordinatorAddress || zeroAddress,
  //       functionName: 'rebalanceDelay'
  //     },
  //     {
  //       abi: RioLRTCoordinatorABI,
  //       address: coordinatorAddress || zeroAddress,
  //       functionName: 'assetLastRebalancedAt',
  //       args: [lrt.address]
  //     }
  //   ]
  // });

  // const nextRebalanceTimestamp = useMemo(() => {
  //   if (!data) return undefined;
  //   const rebalanceDelay = data[0].result;
  //   const assetLastRebalancedAt = data[1].result;

  //   if (isUndefined(rebalanceDelay) || isUndefined(assetLastRebalancedAt)) {
  //     return undefined;
  //   }

  //   return Math.max(
  //     Math.floor(Date.now() / 1000),
  //     Number(asType<bigint>(assetLastRebalancedAt) + BigInt(rebalanceDelay))
  //   );
  // }, [data]);

  // useEffect(() => {
  //   const msUntilNextRebalance =
  //     (nextRebalanceTimestamp || 0) * 1000 - Date.now();
  //   if (msUntilNextRebalance < 0) return;
  //   const timeout = setTimeout(
  //     () => refetch().catch(console.error),
  //     msUntilNextRebalance + 1000
  //   );
  //   return () => clearTimeout(timeout);
  // }, [nextRebalanceTimestamp]);

  return (
    <WithdrawalRequestHistoryInternal
      withdrawalRequests={withdrawalRequests}
      // nextRebalanceTimestamp={nextRebalanceTimestamp}
      nextRebalanceTimestamp={0}
      className={className}
    />
  );
}

function WithdrawalRequestHistoryInternal({
  withdrawalRequests,
  nextRebalanceTimestamp,
  className
}: {
  withdrawalRequests: WithdrawalRequest[];
  nextRebalanceTimestamp?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        'bg-background rounded-b-xl overflow-hidden border-t border-t-border',
        className
      )}
      layoutId="withdraw-history"
    >
      <table className="min-w-full">
        <AnimatePresence>
          <motion.tbody
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            transition={{
              duration: 0.2
            }}
          >
            {withdrawalRequests?.map((item, index) => (
              <WithdrawalRequestRow
                key={index}
                transaction={item}
                index={index}
                nextRebalanceTimestamp={nextRebalanceTimestamp}
              />
            ))}
          </motion.tbody>
        </AnimatePresence>
      </table>
    </motion.div>
  );
}
