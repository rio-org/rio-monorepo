import React from 'react';
import { TransactionEvent } from '../../lib/typings';
import TableLabel from './TableLabel';
import cx from 'classnames';
import { linkToTxOnBlockExplorer } from '../../lib/utilities';
import IconExternal from '../Icons/IconExternal';

type Props = {
  event: TransactionEvent;
  isFirst?: boolean;
};

const TableRow = ({ event, isFirst }: Props) => {
  const chainId = 1;
  return (
    <tr className="group bg-white divide-gray-100">
      <td
        className={cx(
          'p-4 pl-6 text-right bg-white group-hover:bg-[var(--color-gray-hover)] transition-colors',
          isFirst && 'rounded-tl-xl'
        )}
      >
        <TableLabel>
          <a
            href={linkToTxOnBlockExplorer('0x000', chainId)}
            target="_blank"
            rel="noreferrer"
            className={cx(
              `px-[8px] py-[4px] whitespace-nowrap text-sm flex items-center rounded-full w-fit gap-2 h-fit transition-colors duration-200 leading-none`
            )}
          >
            <span className="pt-1">{event.date}</span>
            <IconExternal transactionStatus="None" />
          </a>
        </TableLabel>
      </td>
      <td className="p-4 text-right bg-white group-hover:bg-[var(--color-gray-hover)] transition-colors">
        <TableLabel>{event.type}</TableLabel>
      </td>

      <td className="p-4 text-right bg-white group-hover:bg-[var(--color-gray-hover)] transition-colors">
        <TableLabel textDirection="right">
          ${event.historicalReEthPrice.toLocaleString()}
        </TableLabel>
      </td>
      <td className="p-4 text-right bg-white group-hover:bg-[var(--color-gray-hover)] transition-colors">
        <div className="flex flex-col">
          <TableLabel textDirection="right">
            {event.amountReEth} reETH
          </TableLabel>
          <TableLabel isSecondary={true} textDirection="right">
            $
            {(+(event.amountReEth * event.historicalReEthPrice).toFixed(
              2
            )).toLocaleString()}
          </TableLabel>
        </div>
      </td>
      <td
        className={cx(
          'p-4 pr-6 text-right bg-white group-hover:bg-[var(--color-gray-hover)] transition-colors',
          isFirst && 'rounded-tr-xl'
        )}
      >
        <TableLabel textDirection="right">{event.balance} reETH</TableLabel>
        <TableLabel isSecondary={true} textDirection="right">
          $
          {(+(event.balance * event.historicalReEthPrice).toFixed(
            2
          )).toLocaleString()}
        </TableLabel>
      </td>
    </tr>
  );
};

export default TableRow;
