import { AnimatePresence, motion } from 'framer-motion';
import { Spinner, Tooltip } from '@material-tailwind/react';
import { useMediaQuery } from 'react-responsive';
import { useMemo } from 'react';

import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import IconLineArrow from '@rio-monorepo/ui/components/Icons/IconLineArrow';
import IconExternal from '@rio-monorepo/ui/components/Icons/IconExternal';
import { TableRow } from '@rio-monorepo/ui/components/Shared/TableRow';
import Pagination from './Pagination';
import { useTransactionHistory } from '@rio-monorepo/ui/hooks/useUserHistory';
import { usePagination } from '@rio-monorepo/ui/hooks/usePagination';
import { useIsMounted } from '@rio-monorepo/ui/hooks/useIsMounted';
import {
  cn,
  displayAmount,
  displayEthAmount,
  linkToTxOnBlockExplorer
} from '@rio-monorepo/ui/lib/utilities';
import { CHAIN_ID } from '@rio-monorepo/ui/config';
import {
  type LRTDetails,
  type MobileTableColumns,
  type TableColumn,
  type TransactionEvent,
  TransactionType
} from '@rio-monorepo/ui/lib/typings';
import {
  DESKTOP_MQ,
  TX_HISTORY_TABLE_HEADER_LABELS
} from '@rio-monorepo/ui/lib/constants';
import { IconInfo } from '@rio-monorepo/ui/components/Icons/IconInfo';

interface Props {
  lrt?: LRTDetails;
}

const TransactionHistoryTable = ({ lrt }: Props) => {
  const isDesktopOrLaptop = useMediaQuery({ query: DESKTOP_MQ });
  const { address } = useAccountIfMounted();
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
                className={cn(
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
              ${displayAmount(item.restakingTokenPriceUSD, 2, 2)}
            </TableLabel>
          );
        }
      },
      {
        key: 'amountChange',
        label: 'Amount',
        render(TableLabel, item) {
          const amountChange = displayEthAmount(item.amountChange.toString());
          return (
            <div className="flex flex-col">
              <TableLabel
                textDirection="right"
                className="justify-center items-center"
              >
                <span>
                  {item.type === TransactionType.Request ? '-' : ''}
                  {amountChange} {item.amountChangeSymbol}
                </span>

                {+amountChange !== item.amountChange && (
                  <Tooltip
                    placement="top-end"
                    content={`Exact amount: ${item.amountChange} reETH`}
                  >
                    <button className="ml-1">
                      <IconInfo />
                    </button>
                  </Tooltip>
                )}
              </TableLabel>
              <TableLabel isSecondary={true} textDirection="right">
                {item.type === TransactionType.Request ? '-' : ''}$
                {displayAmount(item.valueUSD, 2, 2)}
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
                  href={linkToTxOnBlockExplorer(item.tx, CHAIN_ID)}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
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
            const amountChange = displayEthAmount(item.amountChange.toString());
            return (
              <div className="flex flex-col">
                <TableLabel
                  textDirection="right"
                  className="justify-center items-center"
                >
                  <span>
                    {item.type === TransactionType.Request ? '-' : ''}
                    {amountChange} {item.amountChangeSymbol}
                  </span>

                  {+amountChange !== item.amountChange && (
                    <Tooltip
                      placement="top-end"
                      content={`Exact amount: ${item.amountChange} reETH`}
                    >
                      <button className="ml-1">
                        <IconInfo />
                      </button>
                    </Tooltip>
                  )}
                </TableLabel>
                <TableLabel isSecondary={true} textDirection="right">
                  {item.type === TransactionType.Request ? '-' : ''}$
                  {displayAmount(item.valueUSD, 2, 2)}
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
                ${displayAmount(item.valueUSD, 2, 2)}
              </TableLabel>
            );
          }
        }
      ]
    }),
    []
  );

  const tableHeader = isMounted && isDesktopOrLaptop && (
    <motion.thead layoutId="table-header">
      <tr>
        {TX_HISTORY_TABLE_HEADER_LABELS.map((head, i) => (
          <th
            key={head}
            className={cn(
              'text-[12px] font-normal px-4 py-2 opacity-50',
              i < 2 ? 'text-left' : 'text-right',
              i === 0 && 'pl-6',
              i === TX_HISTORY_TABLE_HEADER_LABELS.length - 1 && 'pr-6'
            )}
          >
            {head}
          </th>
        ))}
      </tr>
    </motion.thead>
  );

  return (
    <div>
      <h1 className="text-2xl mb-5 font-medium">Transaction History</h1>
      <AnimatePresence mode="wait">
        {isLoading || !address || !txHistory?.length ? (
          <motion.div
            className="bg-[var(--color-element-wrapper-bg)] p-1 rounded-t-2xl rounded-b-2xl relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            layoutId="table-wrapper"
          >
            <table className="w-full">{tableHeader}</table>
            <motion.div
              key="loading"
              className="bg-white w-full h-30 flex items-center justify-center border-t border-blue-gray-50 px-4 py-8 rounded-xl"
            >
              {isLoading ? (
                <Spinner color="blue" />
              ) : (
                <p className="opacity-50 text-center w-full">
                  {!address
                    ? 'Connect to see your transactions'
                    : !txHistory?.length && 'No transaction history'}
                </p>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="bg-[var(--color-element-wrapper-bg)] p-1 rounded-t-2xl rounded-b-xl relative"
              layout
              key={pagination.currentPage}
              initial={false}
              transition={{ duration: 0.05 }}
              layoutId="table-wrapper"
            >
              <motion.table
                className={cn(
                  'w-full min-w-fit table-auto text-left rounded-t-xl',
                  pagination.pageCount < 2 && 'rounded-b-xl overflow-hidden'
                )}
              >
                {tableHeader}

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
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionHistoryTable;
