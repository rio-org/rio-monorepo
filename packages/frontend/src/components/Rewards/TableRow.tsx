import React from 'react';
import { TransactionEvent } from '../../lib/typings';
import TableLabel from './TableLabel';
import cx from 'classnames';

type Props = {
  event: TransactionEvent;
  isFirst?: boolean;
};

const TableRow = ({ event, isFirst }: Props) => {
  return (
    <tr className={'divide-gray-100'}>
      <td className={cx('p-4 text-right bg-white', isFirst && 'rounded-tl-xl')}>
        <TableLabel>{event.date}</TableLabel>
      </td>
      <td className="p-4 text-right bg-white">
        <TableLabel>{event.type}</TableLabel>
      </td>

      <td className="p-4 text-right bg-white">
        <TableLabel textDirection="right">
          ${event.historicalReEthPrice.toLocaleString()}
        </TableLabel>
      </td>
      <td className="p-4 text-right bg-white">
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
      <td className={cx('p-4 text-right bg-white', isFirst && 'rounded-tr-xl')}>
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
