import React from 'react';
import { txHistoryData, txHistoryTableHeader } from '../../../placeholder';
import cx from 'classnames';
import TableRow from './TableRow';

const TransactionHistoryTable = () => {
  const pageCount = 10;
  const pages = Array.from(Array(pageCount).keys());
  const [page, setPage] = React.useState(0);
  const prevLabel = '<- Previous';
  const nextLabel = 'Next ->';
  const handlePageNum = (pageNum: number) => {
    if (pageNum < 0 || pageNum >= pageCount) return;
    setPage(pageNum);
  };
  const handleNextPage = () => {
    if (page === pageCount - 1) return;
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page === 0) return;
    setPage(page - 1);
  };

  return (
    <div>
      <h1 className="text-2xl mb-5">Transaction History</h1>
      <div className="bg-[var(--color-element-wrapper-bg)] p-[2px] rounded-t-2xl rounded-b-xl">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {txHistoryTableHeader.map((head, i) => (
                <th
                  key={head}
                  className={cx(
                    'text-[12px] font-normal p-4 opacity-50',
                    i < 2 ? 'text-left' : 'text-right'
                  )}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {txHistoryData.map((event, i) => {
              return (
                <TableRow
                  key={i}
                  event={event}
                  isFirst={i === 0}
                  isLast={i === txHistoryData.length - 1}
                />
              );
            })}
          </tbody>
        </table>
        <div className="bg-white w-full flex items-center justify-between border-t border-blue-gray-50 p-4 rounded-b-xl">
          <button
            className="text-[12px] whitespace-nowrap opacity-50 py-1 px-2 rounded-lg hover:bg-[var(--color-element-wrapper-bg)] transition-colors"
            onClick={() => handlePreviousPage()}
          >
            {prevLabel}
          </button>
          <div className="flex items-center justify-center gap-1 w-full">
            {pages.map((i) => (
              <button
                key={i}
                className={cx(
                  'text-[12px] py-1 px-2 rounded-lg hover:bg-[var(--color-element-wrapper-bg)] transition-colors',
                  i === page
                    ? 'bg-[var(--color-element-wrapper-bg)]'
                    : 'bg-white'
                )}
                onClick={() => handlePageNum(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className="text-[12px] whitespace-nowrap opacity-50 py-1 px-2 rounded-lg hover:bg-[var(--color-element-wrapper-bg)] transition-colors"
            onClick={() => handleNextPage()}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryTable;
