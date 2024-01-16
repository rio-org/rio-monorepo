import React, { useMemo } from 'react';
import TransactionStatusLabel from '../Shared/TransactionStatusLabel';
import SymbolPill from '../Shared/SymbolPill';
import { AnimatePresence, motion } from 'framer-motion';
import { dateFromTimestamp, displayEthAmount } from '../../lib/utilities';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';
import { WithdrawalRequest } from '@rionetwork/sdk-react';
import { useGetAssetsList } from '../../hooks/useGetAssetsList';
import { getAddress } from 'viem';

type Props = {
  transaction: WithdrawalRequest;
  index: number;
};

const WithdrawalRequestRow = ({ transaction, index }: Props) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });
  const animationDuration = 0.1;
  const animationDelay = 0.025;
  const exitDuration = 0.085;

  const { data } = useGetAssetsList();

  const asset = useMemo(() => {
    return data?.find(
      (asset) => getAddress(asset.address) === getAddress(transaction.assetOut)
    );
  }, [data, transaction.assetOut]);

  return (
    <AnimatePresence>
      <motion.tr
        className="flex w-full border-b border-b-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: exitDuration } }}
        transition={{
          duration: animationDuration,
          delay: 0.25 + animationDelay * index
        }}
      >
        <td className="w-full flex flex-row justify-between items-center">
          <div className="w-full py-4 flex flex-row justify-between items-center">
            <div className="flex flex-col items-start px-4 lg:px-6 whitespace-nowrap text-sm font-medium text-gray-900">
              <span className="mb-1 lg:mb-0">
                {dateFromTimestamp(+transaction.timestamp)}
              </span>
              {!isDesktopOrLaptop && (
                <TransactionStatusLabel transaction={transaction} />
              )}
            </div>
            {isDesktopOrLaptop && (
              <div className="flex flex-row flex-1">
                <TransactionStatusLabel transaction={transaction} />
              </div>
            )}
            <div className="px-4 lg:px-6 whitespace-nowrap text-sm flex items-center justify-end gap-2">
              {transaction.amountOut && (
                <div className="flex items-center gap-0 font-medium">
                  <span className="mr-2">
                    {displayEthAmount(transaction.amountOut)}
                  </span>
                  <SymbolPill symbol={asset?.symbol} />
                </div>
              )}
            </div>
          </div>
        </td>
      </motion.tr>
    </AnimatePresence>
  );
};

export default WithdrawalRequestRow;
