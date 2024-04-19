import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '@material-tailwind/react';
import { useMediaQuery } from 'react-responsive';
import { useMemo } from 'react';

import { useAccountIfMounted } from '@rio-monorepo/ui/hooks/useAccountIfMounted';
import { InfoTooltip } from '@rio-monorepo/ui/components/Shared/InfoTooltip';
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

interface Props {
  lrt?: LRTDetails;
}

const TransactionHistoryTable = ({ lrt }: Props) => {
  const isDesktopOrLaptop = useMediaQuery({ query: DESKTOP_MQ });
  const { address, chain } = useAccountIfMounted();
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
                href={linkToTxOnBlockExplorer(item.tx, chain?.id)}
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
          const amountChange = displayEthAmount(
            item.amountChange.toString(),
            5
          );
          return (
            <div className="flex flex-col">
              <TableLabel
                textDirection="right"
                className="justify-center items-center gap-1"
              >
                <span>
                  {item.type === TransactionType.Request ? '-' : ''}
                  {amountChange} {item.amountChangeSymbol}
                </span>

                {+amountChange !== item.amountChange && (
                  <InfoTooltip triggerClassName="ml-1">
                    <p>
                      <span className="font-semibold block">Exact amount</span>
                      <span className="block">
                        {item.amountChange} {item.amountChangeSymbol}
                      </span>
                    </p>
                  </InfoTooltip>
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
    [chain?.id]
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
                  href={linkToTxOnBlockExplorer(item.tx, chain?.id)}
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
            const amountChange = displayEthAmount(
              item.amountChange.toString(),
              5
            );
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
                    <InfoTooltip triggerClassName="ml-1">
                      <p>
                        <span className="font-semibold block">
                          Exact amount
                        </span>
                        <span className="block">
                          {item.amountChange} {item.amountChangeSymbol}
                        </span>
                      </p>
                    </InfoTooltip>
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
                ${displayAmount(item.restakingTokenPriceUSD, 2, 2)}
              </TableLabel>
            );
          }
        }
      ]
    }),
    [chain?.id]
  );

  const tableHeader = isMounted && isDesktopOrLaptop && (
    <motion.thead layoutId="table-header">
      <tr>
        {TX_HISTORY_TABLE_HEADER_LABELS.map((head, i) => (
          <th
            key={head}
            className={cn(
              'text-sm font-bold px-4 py-4 opacity-50',
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
            className="bg-background rounded-[4px] border border-border shadow-cardlight relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            layoutId="table-wrapper"
          >
            <table className="w-full border-b border-border p-1">
              {tableHeader}
            </table>
            <motion.div
              key="loading"
              className="w-full h-30 flex items-center justify-center px-4 py-8"
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
              className="bg-background rounded-[4px] border border-border shadow-cardlight relative"
              layout
              key={pagination.currentPage}
              initial={false}
              transition={{ duration: 0.05 }}
              layoutId="table-wrapper"
            >
              <motion.table
                className={cn(
                  'w-full min-w-fit table-auto text-left',
                  pagination.pageCount < 2 && 'overflow-hidden'
                )}
              >
                {tableHeader}

                <motion.tbody
                  className="divide-y divide-border divide-opacity-50 md:border-t border-border"
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
