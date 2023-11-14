import React from 'react';
import { txHistoryData, txHistoryTableHeader } from '../../../placeholder';
import cx from 'classnames';
import TableRow from './TableRow';
import IconLineArrow from '../Icons/IconLineArrow';

const TransactionHistoryTable = () => {
  const pageCount = 10;
  const pages = Array.from(Array(pageCount).keys());
  const [page, setPage] = React.useState(0);
  const prevLabel = 'Previous';
  const nextLabel = 'Next';
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
      <h1 className="text-2xl mb-5 font-medium">Transaction History</h1>
      <div className="bg-[var(--color-element-wrapper-bg)] p-[2px] rounded-t-2xl rounded-b-xl">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {txHistoryTableHeader.map((head, i) => (
                <th
                  key={head}
                  className={cx(
                    'text-[12px] font-normal px-4 py-2 opacity-50',
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
                />
              );
            })}
          </tbody>
        </table>
        <div className="bg-white w-full flex items-center justify-between border-t border-blue-gray-50 p-4 rounded-b-xl">
          <button
            className="text-[12px] whitespace-nowrap py-1 px-2 rounded-lg hover:bg-[var(--color-element-wrapper-bg)] transition-colors flex flex-row gap-1 items-center group"
            onClick={() => handlePreviousPage()}
          >
            <IconLineArrow direction="left" /> <span className='opacity-50 group-hover:opacity-100'>{prevLabel}</span>
          </button>
          <div className="flex items-center justify-center gap-1 w-full">
            {pages.map((i) => (
              <button
                key={i}
                className={cx(
                  'text-[12px] py-1 px-2 rounded-lg opacity-50 hover:bg-[var(--color-element-wrapper-bg)] transition-colors',
                  i === page
                    ? 'bg-[var(--color-element-wrapper-bg)] opacity-100'
                    : 'bg-white'
                )}
                onClick={() => handlePageNum(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className="text-[12px] whitespace-nowrap py-1 px-2 rounded-lg hover:bg-[var(--color-element-wrapper-bg)] transition-colors flex flex-row gap-1 items-center group"
            onClick={() => handleNextPage()}
          >
            <span className='opacity-50 group-hover:opacity-100'>{nextLabel}</span> <IconLineArrow direction="right" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryTable;
