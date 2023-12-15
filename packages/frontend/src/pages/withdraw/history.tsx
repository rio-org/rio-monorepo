import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import Transaction from '../../components/History/Transaction';
import { historyData } from '../../../placeholder';
import ClaimButton from '../../components/Claim/ClaimButton';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';

const History: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [hasClaimAvailable, setHasClaimAvailable] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (address) {
      setHasClaimAvailable(true);
    } else {
      setHasClaimAvailable(false);
    }
  }, [address]);

  return (
    <WithdrawWrapper noPadding>
      {(isMounted && !address) || !historyData.length ? (
        <h2 className="lg:p-6 p-4 lg:pt-6 text-center opacity-50">
          Connect to see your withdraw history
        </h2>
      ) : (
        <h2 className="px-4 lg:px-6 pt-4 lg:pt-6 lg:pb-1 text-[14px]">
          Withdraw history
        </h2>
      )}

      {isMounted && address && historyData.length > 0 && (
        <div className="bg-white shadow rounded-b-xl overflow-hidden border-t border-t-gray-200">
          <table className="min-w-full">
            <motion.tbody
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ duration: 0.2 }}
            >
              {historyData.map((item, index) => (
                <Transaction key={index} transaction={item} />
              ))}
            </motion.tbody>
          </table>
          {isMounted && hasClaimAvailable && (
            <div className="px-6 mt-2 mb-6">
              <ClaimButton isValid={hasClaimAvailable} />
            </div>
          )}
        </div>
      )}
    </WithdrawWrapper>
  );
};

export default History;
