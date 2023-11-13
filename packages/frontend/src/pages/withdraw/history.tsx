import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import WithdrawWrapper from '../../components/Withdraw/WithdrawWrapper';
import WithdrawTabs from '../../components/Withdraw/WithdrawTabs';
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
    <WithdrawWrapper>
      <div>
        <h1 className="text-2xl">Withdraw</h1>
        <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-element-wrapper-bg)] rounded-2xl">
          <div className="flex justify-between gap-8 w-full px-5 pt-5 pb-3">
            <div className="flex gap-2 justify-center items-center">
              <WithdrawTabs />
            </div>
          </div>
          <div className="bg-white rounded-xl w-full m-[2px] overflow-hidden">
            <h2 className="px-6 pt-6 pb-4">Withdraw history</h2>
            <div className="bg-white shadow overflow-hidden border-t border-t-gray-200">
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
          </div>
        </div>
      </div>
    </WithdrawWrapper>
  );
};

export default History;
