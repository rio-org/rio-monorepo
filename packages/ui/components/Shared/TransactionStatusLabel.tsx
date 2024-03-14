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
import { useAccountIfMounted } from '../../hooks/useAccountIfMounted';
import { cn, linkToTxOnBlockExplorer } from '../../lib/utilities';
import { TransactionStatus } from '../../lib/typings';
import { SECONDS } from '../../lib/constants';

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
  const { chain } = useAccountIfMounted();
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

  const colorClassName = useMemo(() => {
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
          'bg-warning text-warning-foreground border border-warning-border cursor-default',
          isLink && 'hover:bg-[var(--color-yellow-bg-hover)] cursor-pointer'
        );
    }
  }, [isLink, status]);

  const content = (
    <>
      {status === 'Pending' && (
        <div className="rounded-l-[3px] flex items-center bg-warning-border py-1 px-1.5">
          <IconClock />
        </div>
      )}
      <div className="px-2 py-1 whitespace-nowrap flex items-center w-fit gap-1">
        {status === 'Pending' && (
          <span className="leading-0">
            {`${isBeforeNextRebalance ? '1-' : ''}${timeLeft.fromNow(true)}`}
          </span>
        )}
        <span>{status}</span>
        {isLink && <IconExternal transactionStatus={status} />}
      </div>
    </>
  );

  const className = cn(
    'flex w-fit rounded-[4px] text-xs font-bold shrink grow-0 transition-colors duration-200 leading-0',
    colorClassName
  );

  return (
    <>
      {isLink ? (
        <a
          href={linkToTxOnBlockExplorer(
            (transaction.claimTx || transaction.tx) as Hash,
            chain?.id
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
    </>
  );
};

export default TransactionStatusLabel;
