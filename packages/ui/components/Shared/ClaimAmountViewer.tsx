import React from 'react';
import Skeleton from 'react-loading-skeleton';

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
    <div className="flex flex-col justify-center items-center w-full text-center p-4 rounded-xl bg-black bg-opacity-5 text-black min-h-[160px]">
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
