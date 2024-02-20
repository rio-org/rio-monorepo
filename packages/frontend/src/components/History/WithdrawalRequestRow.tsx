import React, { useMemo } from 'react';
import TransactionStatusLabel from '@rio-monorepo/ui/components/Shared/TransactionStatusLabel';
import { AnimatePresence, motion } from 'framer-motion';
import {
  dateFromTimestamp,
  displayEthAmount,
  linkToTxOnBlockExplorer
} from '@rio-monorepo/ui/lib/utilities';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '@rio-monorepo/ui/lib/constants';
import { WithdrawalRequest } from '@rionetwork/sdk-react';
import { useGetAssetsList } from '@rio-monorepo/ui/hooks/useGetAssetsList';
import { Hash, getAddress } from 'viem';
import IconExternal from '@rio-monorepo/ui/components/Icons/IconExternal';
import { CHAIN_ID } from '@rio-monorepo/ui/config';

type Props = {
  transaction: WithdrawalRequest;
  index: number;
  nextRebalanceTimestamp?: number;
};

const WithdrawalRequestRow = ({
  transaction,
  index,
  nextRebalanceTimestamp
}: Props) => {
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
          <div className="w-full py-4 lg:py-2 flex flex-row justify-between items-center">
            <div className="flex flex-col items-start gap-1 px-4 lg:pl-6 whitespace-nowrap text-sm font-medium text-gray-900">
              <span className="mb-1 lg:mb-0">
                {dateFromTimestamp(+transaction.timestamp)}
              </span>
              {!isDesktopOrLaptop && (
                <TransactionStatusLabel
                  nextRebalanceTimestamp={nextRebalanceTimestamp}
                  transaction={transaction}
                  isLink={false}
                />
              )}
            </div>
            {isDesktopOrLaptop && (
              <div className="flex flex-row flex-1">
                <TransactionStatusLabel
                  nextRebalanceTimestamp={nextRebalanceTimestamp}
                  transaction={transaction}
                  isLink={false}
                />
              </div>
            )}
            <div className="px-4 lg:px-2 whitespace-nowrap text-sm flex items-center justify-end gap-4 font-medium">
              {transaction.amountOut && (
                <>
                  <div>
                    {displayEthAmount(transaction.amountOut)} {asset?.symbol}
                  </div>

                  <a
                    href={linkToTxOnBlockExplorer(
                      (transaction.claimTx || transaction.tx) as Hash,
                      CHAIN_ID
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-blackA2 px-3 py-2 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>View</span>
                      <IconExternal />
                    </span>
                  </a>
                </>
              )}
            </div>
          </div>
        </td>
      </motion.tr>
    </AnimatePresence>
  );
};

export default WithdrawalRequestRow;
