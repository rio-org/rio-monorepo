import cx from 'classnames';
import TableRow from './TableRow';
import { useMediaQuery } from 'react-responsive';
import {
  DESKTOP_MQ,
  TX_HISTORY_TABLE_HEADER_LABELS
} from '../../lib/constants';
import { useAccount } from 'wagmi';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import Pagination from './Pagination';
import { useIsMounted } from '../../hooks/useIsMounted';
import { useTransactionHistory } from '../../hooks/useUserHistory';
import { LRTDetails } from '../../lib/typings';
import { usePagination } from '../../hooks/usePagination';

interface Props {
  lrt?: LRTDetails;
}

const TransactionHistoryTable = ({ lrt }: Props) => {
  const isDesktopOrLaptop = useMediaQuery({ query: DESKTOP_MQ });
  const { address } = useAccount();
  const isMounted = useIsMounted();

  const { data: txHistory, isLoading } = useTransactionHistory({
    where: { sender: address, restakingToken: lrt?.address }
  });

  const pagination = usePagination({
    items: txHistory,
    resultsPerPage: 10
  });

  return (
    <div>
      <h1 className="text-2xl mb-5 font-medium">Transaction History</h1>
      <AnimatePresence mode="wait">
        {(isLoading || !isMounted) && (
          <motion.div
            key="loading"
            className="bg-white w-full flex items-center justify-center border-t border-blue-gray-50 p-4 rounded-xl h-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Spinner color="blue" />
          </motion.div>
        )}
        {isMounted && !isLoading && (
          <>
            {address && txHistory ? (
              <motion.div
                className="bg-[var(--color-element-wrapper-bg)] p-[2px] rounded-t-2xl rounded-b-xl relative"
                layout
                key={pagination.currentPage}
                initial={false}
                transition={{ duration: 0.05 }}
                layoutId="table-wrapper"
              >
                {!!txHistory?.length && (
                  <motion.table
                    className={cx(
                      'w-full min-w-fit table-auto text-left',
                      pagination.pageCount < 2 && 'rounded-b-xl overflow-hidden'
                    )}
                  >
                    {isMounted && isDesktopOrLaptop && (
                      <motion.thead layoutId="table-header">
                        <tr>
                          {TX_HISTORY_TABLE_HEADER_LABELS.map((head, i) => (
                            <th
                              key={head}
                              className={cx(
                                'text-[12px] font-normal px-4 py-2 opacity-50',
                                i < 2 ? 'text-left' : 'text-right',
                                i === 0 && 'pl-6',
                                i ===
                                  TX_HISTORY_TABLE_HEADER_LABELS.length - 1 &&
                                  'pr-6'
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
                      {pagination.currentPageItems?.map((event, i) => (
                        <TableRow
                          key={i}
                          event={event}
                          isFirst={i === 0}
                          index={i}
                        />
                      ))}
                    </motion.tbody>
                  </motion.table>
                )}
                {pagination.pageCount > 1 && (
                  <Pagination {...pagination} className="" />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="bg-[var(--color-element-wrapper-bg)] p-[2px] rounded-2xl"
              >
                <div className="bg-white w-full flex items-center justify-between border-t border-blue-gray-50 p-4 rounded-xl">
                  <p className="opacity-50 text-center w-full">
                    {!address && 'Connect to see your transactions'}
                    {!!address && !txHistory && 'No transaction history'}
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionHistoryTable;
