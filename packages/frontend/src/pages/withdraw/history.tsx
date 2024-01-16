import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import WithdrawalRequestRow from '../../components/History/WithdrawalRequestRow';
import ClaimButton from '../../components/Claim/ClaimButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useGetAccountWithdrawals } from '../../hooks/useGetAccountWithdrawals';
import { Spinner } from '@material-tailwind/react';
import { useIsMounted } from '../../hooks/useIsMounted';
import { useGetLiquidRestakingTokens } from '../../hooks/useGetLiquidRestakingTokens';

const History: NextPage = () => {
  const { data: lrts } = useGetLiquidRestakingTokens();
  const lrt = lrts?.[0];

  const isMounted = useIsMounted();
  const [hasClaimAvailable, setHasClaimAvailable] = useState(false);
  const { address } = useAccount();
  const { data, isLoading, refetch } = useGetAccountWithdrawals(
    { where: { sender: address, restakingToken: lrt?.address } },
    { enabled: !!address && !!lrt?.address }
  );

  const { withdrawalRequests, withdrawalParams } = data || {};

  const onSuccess = useCallback(() => {
    refetch().catch(console.error);
  }, [refetch]);

  useEffect(() => {
    setHasClaimAvailable(!!address && !!withdrawalParams?.length);
  }, [address, withdrawalParams]);

  return (
    <WithdrawWrapper noPadding>
      <h2 className="px-4 lg:px-6 pt-4 lg:pt-6 lg:pb-1 text-[14px] font-bold">
        Withdrawal history
      </h2>
      {isLoading || !isMounted ? (
        <motion.div
          className="bg-white w-full flex items-center justify-center border-t border-blue-gray-50 p-4 rounded-xl h-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          layoutId="withdraw-history"
        >
          <Spinner color="blue" />
        </motion.div>
      ) : (
        <>
          {!address && (
            <h2 className="lg:p-6 p-4 lg:pt-6 text-center opacity-50">
              Connect to see your withdraw history
            </h2>
          )}
          {address && withdrawalRequests && withdrawalRequests.length > 0 ? (
            <motion.div
              className="bg-white shadow rounded-b-xl overflow-hidden border-t border-t-gray-200"
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
                      />
                    ))}
                  </motion.tbody>
                </AnimatePresence>
              </table>
              {isMounted && hasClaimAvailable && lrt && (
                <div className="px-6 mt-2 mb-6">
                  <ClaimButton
                    lrt={lrt}
                    claimWithdrawalParams={withdrawalParams || []}
                    onSuccess={onSuccess}
                  />
                </div>
              )}
            </motion.div>
          ) : (
            <div className="bg-white shadow rounded-b-xl overflow-hidden border-t border-t-gray-200">
              <div className="p-4 lg:p-6 text-center opacity-50">
                No withdraws yet
              </div>
            </div>
          )}
        </>
      )}
    </WithdrawWrapper>
  );
};

export default History;
