import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import React, { useMemo } from 'react';
import { Hash } from 'viem';
import dayjs from 'dayjs';
import {
  WithdrawalEpochStatus,
  type WithdrawalRequest
} from '@rionetwork/sdk-react';
import IconExternal from '../Icons/IconExternal';
import { IconClock } from '../Icons/IconClock';
import { cn, linkToTxOnBlockExplorer } from '../../lib/utilities';
import { TransactionStatus } from '../../lib/typings';
import { SECONDS } from '../../lib/constants';
import { CHAIN_ID } from '../../config';

dayjs.extend(relativeTime, {
  thresholds: [
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
  ]
});
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

type Props = {
  transaction: WithdrawalRequest;
  nextRebalanceTimestamp?: number;
  isLink?: boolean;
};

const TransactionStatusLabel = ({
  transaction,
  nextRebalanceTimestamp,
  isLink = true
}: Props) => {
  const now = Date.now();
  const requestTimestamp = Number(+transaction.timestamp);
  const lastTimeToBeAvailable = requestTimestamp + SECONDS.DAYS * 8;
  const timeLeft = dayjs.unix(lastTimeToBeAvailable);
  const isBeforeNextRebalance =
    typeof nextRebalanceTimestamp === 'number' &&
    now / 1000 < nextRebalanceTimestamp &&
    nextRebalanceTimestamp - requestTimestamp < SECONDS.DAYS;

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
        return cn(
          'bg-[var(--color-blue-bg)] text-rio-blue cursor-default',
          isLink && 'hover:bg-[var(--color-blue-bg-hover)] cursor-pointer'
        );
      case 'Available':
        return cn(
          'bg-[var(--color-green-bg)] text-[var(--color-green)] cursor-default',
          isLink && 'hover:bg-[var(--color-green-bg-hover)] cursor-pointer'
        );
      case 'Pending':
      default:
        return cn(
          'bg-[var(--color-yellow-bg)] text-[var(--color-yellow)] cursor-default',
          isLink && 'hover:bg-[var(--color-yellow-bg-hover)] cursor-pointer'
        );
    }
  }, [isLink, status]);

  const content = (
    <>
      {status === 'Pending' && (
        <div className="flex flex-row gap-1 items-center">
          <IconClock />
          {`${isBeforeNextRebalance ? '1-' : ''}${timeLeft.fromNow(true)}`}
        </div>
      )}
      <span>{status}</span>
      {isLink && <IconExternal transactionStatus={status} />}
    </>
  );

  const className = cn(
    `px-2 py-1 whitespace-nowrap text-xs font-semibold flex items-center rounded-full w-fit gap-2 h-fit transition-colors duration-200`,
    extendedClassName
  );

  return (
    <div className="w-full">
      {isLink ? (
        <a
          href={linkToTxOnBlockExplorer(
            (transaction.claimTx || transaction.tx) as Hash,
            CHAIN_ID
          )}
          target="_blank"
          rel="noreferrer"
          className={className}
        >
          {content}
        </a>
      ) : (
        <div className={className}>{content}</div>
      )}
    </div>
  );
};

export default TransactionStatusLabel;
