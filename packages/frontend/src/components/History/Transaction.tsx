import React, { useState } from 'react';
import { WithdrawEvent } from '../../lib/typings';
import TransactionStatusLabel from '../Shared/TransactionStatusLabel';
import SymbolPill from '../Shared/SymbolPill';
import { AnimatePresence, motion } from 'framer-motion';
import { buildAssetList, displayEthAmount } from '../../lib/utilities';
import ItemizedAsset from '../Assets/ItemizedAsset';
import IconSelectArrow from '../Icons/IconSelectArrow';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';

type Props = {
  transaction: WithdrawEvent;
  index: number;
};

const Transaction = ({ transaction, index }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const assets = buildAssetList(transaction.symbol);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });
  const animationDuration = 0.1;
  const animationDelay = 0.025;
  const exitDuration = 0.085;

  return (
    <>
      <motion.tr
        className="flex w-full border-b border-b-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: exitDuration } }}
        transition={{
          duration: animationDuration,
          delay: animationDelay * index
        }}
      >
        <td className="w-full flex flex-row justify-between items-center">
          <button
            className="w-full py-4 hover:bg-[var(--color-gray-hover)] transition-colors flex flex-row justify-between items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex flex-col items-start px-4 lg:px-6 whitespace-nowrap text-sm font-medium text-gray-900">
              <span className="mb-1 lg:mb-0">{transaction.date}</span>
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
              <div className="flex items-center gap-0 font-medium">
                <span className="mr-2">
                  {displayEthAmount(transaction.amount.toString())}
                </span>
                <SymbolPill symbol={transaction.symbol} />
              </div>
              <IconSelectArrow direction={isOpen ? 'up' : 'down'} />
            </div>
          </button>
        </td>
      </motion.tr>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          >
            {/* inner padding to prevent jump when wrapper is removed */}
            <div className="mt-2 mb-4 flex flex-col gap-2 ">
              {assets.map((asset) => {
                return (
                  <div className="px-4 lg:pl-6 lg:pr-[44px]">
                    <ItemizedAsset
                      key={asset.symbol}
                      asset={asset}
                      isActiveToken={false}
                      isLoading={false}
                      isError={false}
                      amount={transaction.amount}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Transaction;
