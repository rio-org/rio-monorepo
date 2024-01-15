import React, { useMemo } from 'react';
import { EthereumAddress, TransactionStatus } from '../../lib/typings';
import IconExternal from '../Icons/IconExternal';
import { IconClock } from '../Icons/IconClock';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { linkToTxOnBlockExplorer } from '../../lib/utilities';
import { CHAIN_ID } from '../../../config';
import {
  WithdrawalEpochStatus,
  WithdrawalRequest
} from '@rionetwork/sdk-react';
import { twJoin, twMerge } from 'tailwind-merge';

type Props = {
  transaction: WithdrawalRequest;
};

const TransactionStatusLabel = ({ transaction }: Props) => {
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

  const status = useMemo<TransactionStatus>(() => {
    if (transaction.claimTx) return 'Claimed';
    if (transaction.epochStatus === WithdrawalEpochStatus.Settled) {
      return 'Available';
    }
    return 'Pending';
  }, [transaction.claimTx, transaction.epochStatus]);

  const extendedClassName = useMemo(() => {
    switch (status) {
      case 'Claimed':
        return twJoin(
          'bg-[var(--color-blue-bg)] text-[var(--color-blue)]',
          'hover:bg-[var(--color-blue-bg-hover)]'
        );
      case 'Available':
        return twJoin(
          'bg-[var(--color-green-bg)] text-[var(--color-green)]',
          'hover:bg-[var(--color-green-bg-hover)]'
        );
      case 'Pending':
      default:
        return twJoin(
          'bg-[var(--color-yellow-bg)] text-[var(--color-yellow)]',
          'hover:bg-[var(--color-yellow-bg-hover)]'
        );
    }
  }, [status]);

  return (
    <div className="w-full">
      <a
        href={linkToTxOnBlockExplorer(
          (transaction.claimTx || transaction.tx) as EthereumAddress,
          CHAIN_ID
        )}
        target="_blank"
        rel="noreferrer"
        className={twMerge(
          `px-[8px] py-[4px] whitespace-nowrap text-sm flex items-center rounded-full w-fit gap-2 h-fit transition-colors duration-200`,
          extendedClassName
        )}
      >
        {status === 'Pending' && (
          <div className="flex flex-row gap-1 items-center">
            <IconClock />
            {timeLeft.fromNow(true)}
          </div>
        )}
        <span>{status}</span>
        <IconExternal transactionStatus={status} />
      </a>
    </div>
  );
};

export default TransactionStatusLabel;
