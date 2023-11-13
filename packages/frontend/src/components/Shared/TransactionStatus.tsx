import React from 'react';
import { TransactionEvent, TransactionStatus } from '../../lib/typings';
import cx from 'classnames';
import IconExternal from '../Icons/IconExternal';
import { IconClock } from '../Icons/IconClock';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { linkToTxOnBlockExplorer } from '../../lib/utilities';

type Props = {
  transaction: TransactionEvent;
};

const TransactionStatus = ({ transaction }: Props) => {
  const chainId = 1;
  const thresholds = [
    { l: 's', r: 1 },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'm' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'h' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 29, d: 'd' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'm' },
    { l: 'y', r: 1 },
    { l: 'yy', d: 'y' }
  ];

  const config = {
    thresholds: thresholds
  };
  dayjs.extend(relativeTime, config);
  dayjs.extend(updateLocale);
  dayjs.updateLocale('en', {
    relativeTime: {
      future: '',
      past: '',
      s: '%ds',
      m: '%dm',
      mm: '%dm',
      h: '%dh',
      hh: '%dh',
      d: '%dd',
      dd: '%dd',
      M: '',
      MM: '',
      y: '',
      yy: ''
    }
  });

  const today = new Date();
  const endDateTime = today.setDate(today.getDate() + 7) / 1000;
  const timeLeft = dayjs.unix(endDateTime);

  return (
    <div className="w-full">
      <a
        href={linkToTxOnBlockExplorer('0x000', chainId)}
        target="_blank"
        rel="noreferrer"
        className={cx(
          `px-[8px] py-[4px] whitespace-nowrap text-sm flex items-center rounded-full w-fit gap-2 h-fit transition-colors duration-200`,
          transaction.status === 'Pending' &&
            'bg-[var(--color-yellow-bg)] text-[var(--color-yellow)] hover:bg-[var(--color-yellow-bg-hover)]',
          transaction.status === 'Available' &&
            'bg-[var(--color-green-bg)] text-[var(--color-green)] hover:bg-[var(--color-green-bg-hover)]',
          transaction.status === 'Claimed' &&
            'bg-[var(--color-blue-bg)] text-[var(--color-blue)] hover:bg-[var(--color-blue-bg-hover)]'
        )}
      >
        {transaction.status === 'Pending' && (
          <div className="flex flex-row gap-1 items-center">
            <IconClock />
            {timeLeft.fromNow(true)}
          </div>
        )}
        <span>{transaction.status}</span>
        <IconExternal transactionStatus={transaction.status} />
      </a>
    </div>
  );
};

export default TransactionStatus;
