import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { twJoin } from 'tailwind-merge';

type Props = {
  title?: string;
  amount?: number;
  symbol?: string;
};

export function ClaimAmountViewer({
  symbol,
  amount,
  title = 'Available to claim now'
}: Props) {
  return (
    <div
      className={twJoin(
        'flex flex-col justify-center items-center',
        'w-full min-h-[160px] p-4',
        'text-center text-black',
        'rounded-xl bg-black bg-opacity-5'
      )}
    >
      <div>
        <p className="opacity-50">{title}</p>
        <p className="text-[30px]">
          <strong>
            {[typeof amount, typeof symbol].includes('undefined') ? (
              <Skeleton height={30} width={80} />
            ) : (
              <>
                {amount?.toLocaleString(undefined, {
                  maximumFractionDigits: 5
                })}{' '}
                {symbol}
              </>
            )}
          </strong>
        </p>
      </div>
    </div>
  );
}
