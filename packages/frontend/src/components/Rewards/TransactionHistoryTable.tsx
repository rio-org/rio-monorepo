import React, { useEffect, useState } from 'react';
import { txHistoryTableHeader } from '../../../placeholder';
import cx from 'classnames';
import TableRow from './TableRow';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';
import { useAccount } from 'wagmi';
import { useGetAccountTxHistory } from '../../hooks/useGetAccountTxHistory';
import { EthereumAddress } from '../../lib/typings';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import Pagination from './Pagination';

const TransactionHistoryTable = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [page, setPage] = useState(0);
  const { address } = useAccount();
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });
  const resultsPerPage = 10;
  const txHistory = useGetAccountTxHistory(
    address as EthereumAddress,
    resultsPerPage,
    page
  );
  const pages = Array.from(Array(txHistory.pageCount).keys());

  const handlePageNum = (pageNum: number) => {
    if (pageNum < 0 || pageNum >= txHistory.pageCount) return;
    setPage(pageNum);
  };
  const handleNextPage = () => {
    if (page === txHistory.pageCount - 1) return;
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page === 0) return;
    setPage(page - 1);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-5 font-medium">Transaction History</h1>
      <AnimatePresence mode="wait">
        {(txHistory.isLoading || !isMounted) && (
          <motion.div
            className="bg-white w-full flex items-center justify-center border-t border-blue-gray-50 p-4 rounded-xl h-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Spinner color="blue" />
          </motion.div>
        )}
      </AnimatePresence>
      {isMounted && (
        <>
          {address ? (
            <AnimatePresence mode="wait">
              <motion.div
                className="bg-[var(--color-element-wrapper-bg)] p-[2px] rounded-t-2xl rounded-b-xl relative"
                layout
                key={page}
                initial={false}
                transition={{
                  duration: 0.05
                }}
                layoutId="table-wrapper"
              >
                {txHistory.data.length > 0 && (
                  <table
                    className={cx(
                      'w-full min-w-fit table-auto text-left',
                      txHistory.pageCount < 2 && 'rounded-b-xl overflow-hidden'
                    )}
                  >
                    {isMounted && isDesktopOrLaptop && (
                      <motion.thead layoutId="table-header">
                        <tr>
                          {txHistoryTableHeader.map((head, i) => (
                            <th
                              key={head}
                              className={cx(
                                'text-[12px] font-normal px-4 py-2 opacity-50',
                                i < 2 ? 'text-left' : 'text-right',
                                i === 0 && 'pl-6',
                                i === txHistoryTableHeader.length - 1 && 'pr-6'
                              )}
                            >
                              {head}
                            </th>
                          ))}
                        </tr>
                      </motion.thead>
                    )}

                    <motion.tbody
                      className="divide-y divide-[var(--color-element-wrapper-bg)]"
                      layoutId="table-body"
                      transition={{
                        duration: 0.075
                      }}
                    >
                      {txHistory.data.map((event, i) => {
                        return (
                          <TableRow
                            key={i}
                            event={event}
                            isFirst={i === 0}
                            index={i}
                          />
                        );
                      })}
                    </motion.tbody>
                  </table>
                )}
                {txHistory.pageCount > 1 && (
                  <Pagination
                    page={page}
                    pages={pages}
                    hasNextPage={txHistory.hasNextPage}
                    handleNextPage={handleNextPage}
                    handlePreviousPage={handlePreviousPage}
                    handlePageNum={handlePageNum}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="bg-[var(--color-element-wrapper-bg)] p-[2px] rounded-2xl">
              <div className="bg-white w-full flex items-center justify-between border-t border-blue-gray-50 p-4 rounded-xl">
                <p className="opacity-50 text-center w-full">
                  Connect to see your transactions
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistoryTable;
