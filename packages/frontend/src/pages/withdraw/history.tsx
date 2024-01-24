import React from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '@/components/Withdraw/WithdrawWrapper';
import WithdrawalRequestRow from '@/components/History/WithdrawalRequestRow';
import { AnimatePresence, motion } from 'framer-motion';
import { useGetAccountWithdrawals } from '@rio-monorepo/ui/hooks/useGetAccountWithdrawals';
import { Spinner } from '@material-tailwind/react';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { useGetLiquidRestakingTokens } from '@rio-monorepo/ui/hooks/useGetLiquidRestakingTokens';
import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';

const History: NextPage = () => {
  const { data: lrts } = useGetLiquidRestakingTokens();
  const lrt = lrts?.[0];

  const isMounted = useIsMounted();
  const { address } = useAccountIfMounted();
  const { data, isLoading, isFetched } = useGetAccountWithdrawals(
    { where: { sender: address, restakingToken: lrt?.address } },
    { enabled: !!address && !!lrt?.address }
  );

  const { withdrawalRequests } = data || {};

  return (
    <WithdrawWrapper noPadding>
      <h2 className="px-4 lg:px-6 pt-4 lg:pt-6 lg:pb-1 text-[14px] font-bold">
        Withdrawal history
      </h2>
      {!!address && (isLoading || !isMounted || !isFetched) ? (
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
          {withdrawalRequests && withdrawalRequests.length > 0 ? (
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
            </motion.div>
          ) : (
            address && (
              <div className="bg-white shadow rounded-b-xl overflow-hidden border-t border-t-gray-200">
                <div className="p-4 lg:p-6 text-center opacity-50">
                  No withdraws yet
                </div>
              </div>
            )
          )}
        </>
      )}
    </WithdrawWrapper>
  );
};

export default History;
