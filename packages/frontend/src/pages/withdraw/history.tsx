import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import Transaction from '../../components/History/Transaction';
import { historyData } from '../../../placeholder';
import { Spinner } from '@material-tailwind/react';
import ClaimButton from '../../components/Claim/ClaimButton';

const History: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [hasClaimAvailable, setHasClaimAvailable] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    setHasClaimAvailable(true);
  }, []);

  return (
    <WithdrawWrapper noPadding>
      <h2 className="px-4 lg:px-6 pt-4 lg:pt-6 lg:pb-1 text-[14px]">
        Withdraw history
      </h2>
      <div className="bg-white shadow rounded-b-xl overflow-hidden border-t border-t-gray-200">
        {isMounted ? (
          <table className="min-w-full">
            <tbody>
              {historyData.length &&
                historyData.map((item, index) => (
                  <Transaction key={index} transaction={item} />
                ))}
              {!historyData.length && (
                <div className="border-b border-b-gray-200">
                  <tr className="flex w-full py-4 hover:bg-[var(--color-gray-hover)] transition-colors text-center">
                    No withdraw history
                  </tr>
                </div>
              )}
            </tbody>
          </table>
        ) : (
          <div className="w-full text-center min-h-[100px] flex items-center justify-center">
            <Spinner />
          </div>
        )}
        {isMounted && hasClaimAvailable && (
          <div className="px-6 mt-2 mb-6">
            <ClaimButton isValid={hasClaimAvailable} />
          </div>
        )}
      </div>
    </WithdrawWrapper>
  );
};

export default History;
