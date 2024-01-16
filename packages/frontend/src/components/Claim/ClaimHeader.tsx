import React from 'react';
import Skeleton from 'react-loading-skeleton';

type Props = {
  amount?: number;
  symbol?: string;
};

const ClaimHeader = ({ symbol, amount }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center w-full text-center p-4 rounded-xl bg-black bg-opacity-5 text-black min-h-[160px]">
      <div>
        <p className="opacity-50">Available to claim now</p>
        <p className="text-[30px]">
          <strong>
            {[typeof amount, typeof symbol].includes('undefined') ? (
              <Skeleton height={30} width={80} />
            ) : (
              <>
                {amount} {symbol}
              </>
            )}
          </strong>
        </p>
      </div>
    </div>
  );
};

export default ClaimHeader;
