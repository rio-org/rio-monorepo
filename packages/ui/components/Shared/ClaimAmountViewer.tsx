import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { twJoin } from 'tailwind-merge';
import { InfoTooltip } from './InfoTooltip';

type Props = {
  title?: string;
  amount?: number;
  symbol?: string;
  infoTooltipContent?: React.ReactNode | React.ReactNode[];
};

export function ClaimAmountViewer({
  symbol,
  amount,
  title = 'Available to claim now',
  infoTooltipContent
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
        <p>
          <span className="opacity-50">{title}</span>{' '}
          {infoTooltipContent && (
            <InfoTooltip align="center">{infoTooltipContent}</InfoTooltip>
          )}
        </p>
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
