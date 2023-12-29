import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import Transaction from '../../components/History/Transaction';
import ClaimButton from '../../components/Claim/ClaimButton';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useGetAccountWithdrawals } from '../../hooks/useGetAccountWithdrawals';
import { EthereumAddress } from '../../lib/typings';
import { Spinner } from '@material-tailwind/react';

const History: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [hasClaimAvailable, setHasClaimAvailable] = useState(false);
  const { address } = useAccount();
  const accountWithdrawals = useGetAccountWithdrawals(
    address as EthereumAddress
  );
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (address) {
      // setHasClaimAvailable(true);
      // TODO: check if user has claimable rewards when available
    } else {
      setHasClaimAvailable(false);
    }
  }, [address]);

  return (
    <WithdrawWrapper noPadding>
      <h2 className="px-4 lg:px-6 pt-4 lg:pt-6 lg:pb-1 text-[14px] font-bold">
        Withdrawal history
      </h2>
      {accountWithdrawals.isLoading || !isMounted ? (
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
          {address &&
          accountWithdrawals.data &&
          accountWithdrawals.data.length > 0 ? (
            <motion.div
              className="bg-white shadow rounded-b-xl overflow-hidden border-t border-t-gray-200"
              layoutId="withdraw-history"
            >
              <table className="min-w-full">
                <motion.tbody
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{
                    duration: 0.2
                  }}
                >
                  {accountWithdrawals.data?.map((item, index) => (
                    <Transaction key={index} transaction={item} index={index} />
                  ))}
                </motion.tbody>
              </table>
              {isMounted && hasClaimAvailable && (
                <div className="px-6 mt-2 mb-6">
                  <ClaimButton isValid={hasClaimAvailable} />
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
