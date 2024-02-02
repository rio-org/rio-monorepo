import cx from 'classnames';
import { TableRow } from '@rio-monorepo/ui/components/Shared/TableRow';
import { useMediaQuery } from 'react-responsive';
import {
  DESKTOP_MQ,
  TX_HISTORY_TABLE_HEADER_LABELS
} from '@rio-monorepo/ui/lib/constants';
import { useAccount } from 'wagmi';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import Pagination from './Pagination';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import { useTransactionHistory } from '@rio-monorepo/ui/hooks/useUserHistory';
import {
  type LRTDetails,
  type MobileTableColumns,
  type TableColumn,
  type TransactionEvent,
  TransactionType
} from '@rio-monorepo/ui/lib/typings';
import { usePagination } from '@rio-monorepo/ui/hooks/usePagination';
import { useMemo } from 'react';
import IconExternal from '@rio-monorepo/ui/components/Icons/IconExternal';
import { linkToTxOnBlockExplorer } from '@rio-monorepo/ui/lib/utilities';
import { CHAIN_ID } from '@rio-monorepo/ui/config';
import IconLineArrow from '@rio-monorepo/ui/components/Icons/IconLineArrow';

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

  const tableColumns = useMemo<TableColumn<TransactionEvent>[]>(
    () => [
      {
        key: 'date',
        label: 'Date',
        render(TableLabel, item) {
          return (
            <TableLabel>
              <a
                href={linkToTxOnBlockExplorer(item.tx, CHAIN_ID)}
                target="_blank"
                rel="noreferrer"
                className={cx(
                  'w-fit h-fit r-[8px] py-[4px]',
                  'whitespace-nowrap text-sm leading-none',
                  'flex items-center rounded-full gap-2',
                  'transition-colors duration-200'
                )}
              >
                <span className="pt-1">{item.date}</span>
                <IconExternal transactionStatus="None" />
              </a>
            </TableLabel>
          );
        }
      },
      {
        key: 'type',
        label: 'Transaction'
      },
      {
        key: 'restakingTokenPriceUSD',
        label: 'Historical reETH Price',
        render(TableLabel, item) {
          return (
            <TableLabel textDirection="right">
              $
              {item.restakingTokenPriceUSD.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </TableLabel>
          );
        }
      },
      {
        key: 'amountChange',
        label: 'Amount',
        render(TableLabel, item) {
          return (
            <div className="flex flex-col">
              <TableLabel textDirection="right">
                {item.type === TransactionType.Request ? '-' : ''}
                {item.amountChange} reETH
              </TableLabel>
              <TableLabel isSecondary={true} textDirection="right">
                {item.type === TransactionType.Request ? '-' : ''}$
                {item.valueUSD.toFixed(2).toLocaleString()}
              </TableLabel>
            </div>
          );
        }
      }
    ],
    []
  );

  const mobileColumns = useMemo<MobileTableColumns<TransactionEvent>>(
    () => ({
      top: [
        {
          key: 'date',
          label: 'Date',
          render(TableLabel, item) {
            return (
              <TableLabel>
                <a
                  href={linkToTxOnBlockExplorer('0x000', CHAIN_ID)}
                  target="_blank"
                  rel="noreferrer"
                  className={cx(
                    'w-fit h-fit',
                    'whitespace-nowrap text-sm leading-none',
                    'flex items-center gap-1',
                    'rounded-full transition-colors duration-200'
                  )}
                >
                  <span className="pt-1">{item.date}</span>
                  <IconLineArrow direction="external" />
                </a>
              </TableLabel>
            );
          }
        },
        {
          key: 'amountChange',
          label: 'Amount',
          render(TableLabel, item) {
            return (
              <div className="flex flex-col">
                <TableLabel textDirection="right">
                  {item.type === TransactionType.Request ? '-' : ''}
                  {item.amountChange} reETH
                </TableLabel>
                <TableLabel isSecondary={true} textDirection="right">
                  {item.type === TransactionType.Request ? '-' : ''}$
                  {item.valueUSD.toFixed(2).toLocaleString()}
                </TableLabel>
              </div>
            );
          }
        }
      ],
      expanded: [
        {
          key: 'type',
          label: 'Transaction'
        },
        {
          key: 'valueUSD',
          label: 'Historical reETH Price',
          render(TableLabel, item) {
            return (
              <TableLabel textDirection="right">
                ${item.valueUSD.toLocaleString()}
              </TableLabel>
            );
          }
        }
      ]
    }),
    []
  );

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
            {address && !!txHistory?.length ? (
              <motion.div
                className="bg-[var(--color-element-wrapper-bg)] p-1 rounded-t-2xl rounded-b-xl relative"
                layout
                key={pagination.currentPage}
                initial={false}
                transition={{ duration: 0.05 }}
                layoutId="table-wrapper"
              >
                <motion.table
                  className={cx(
                    'w-full min-w-fit table-auto text-left rounded-t-xl',
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
                              i === TX_HISTORY_TABLE_HEADER_LABELS.length - 1 &&
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
                        item={event}
                        columns={tableColumns}
                        mobileColumns={mobileColumns}
                        isFirst={i === 0}
                        index={i}
                      />
                    ))}
                  </motion.tbody>
                </motion.table>
                {pagination.pageCount > 1 && (
                  <Pagination {...pagination} className="" />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="bg-[var(--color-element-wrapper-bg)] p-1 rounded-2xl"
              >
                <div className="bg-white w-full flex items-center justify-between border-t border-blue-gray-50 px-4 py-8 rounded-xl">
                  <p className="opacity-50 text-center w-full">
                    {!address
                      ? 'Connect to see your transactions'
                      : !txHistory?.length && 'No transaction history'}
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
