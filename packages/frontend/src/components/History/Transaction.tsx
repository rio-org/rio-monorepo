import React, { useState } from 'react';
import { WithdrawEvent } from '../../lib/typings';
import TransactionStatusLabel from '../Shared/TransactionStatusLabel';
import SymbolPill from '../Shared/SymbolPill';
import { AnimatePresence, motion } from 'framer-motion';
import { buildAssetList } from '../../lib/utilities';
import ItemizedAsset from '../Assets/ItemizedAsset';
import IconSelectArrow from '../Icons/IconSelectArrow';

type Props = {
  transaction: WithdrawEvent;
};

const Transaction = ({ transaction }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const assets = buildAssetList(transaction.symbol);

  return (
    <div className="border-b border-b-gray-200">
      <tr className="flex w-full">
        <button
          className="w-full py-4 hover:bg-[var(--color-gray-hover)] transition-colors flex flex-row justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <td className="px-6 whitespace-nowrap text-sm font-medium text-gray-900">
            {transaction.date}
          </td>
          <td className="flex flex-row flex-1">
            <TransactionStatusLabel transaction={transaction} />
          </td>
          <td className="px-6 whitespace-nowrap text-sm flex items-center justify-end gap-2">
            <div className="flex items-center gap-0">
              <span className="mr-2">12.83</span>
              <SymbolPill symbol="＊ETH" />
            </div>
            <IconSelectArrow direction={isOpen ? 'up' : 'down'} />
          </td>
        </button>
      </tr>
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
            <div className="mt-2 mb-4 flex flex-col w-full gap-2 ">
              {assets.map((asset) => {
                return (
                  <div className="pl-6 pr-12">
                    <ItemizedAsset
                      key={asset.symbol}
                      asset={asset}
                      isActiveToken={false}
                      isLoading={false}
                      isError={false}
                      amount={'0.00'}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Transaction;
