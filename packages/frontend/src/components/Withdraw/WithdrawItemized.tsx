import Skeleton from 'react-loading-skeleton';
import { twJoin } from 'tailwind-merge';
import { formatUnits } from 'viem';
import Image from 'next/image';
import React, { useMemo } from 'react';
import HR from '@rio-monorepo/ui/components/Shared/HR';
import { useAssetExchangeRate } from '@rio-monorepo/ui/hooks/useAssetExchangeRate';
import { cn, displayEthAmount } from '@rio-monorepo/ui/lib/utilities';
import {
  type AssetDetails,
  type LRTDetails
} from '@rio-monorepo/ui/lib/typings';

type Props = {
  activeToken?: AssetDetails;
  lrtDetails?: LRTDetails;
  amount: bigint | null | undefined;
  assets: AssetDetails[];
};

const WithdrawItemized = ({
  assets,
  amount,
  lrtDetails,
  activeToken
}: Props) => {
  const { data: exchangeRate } = useAssetExchangeRate({
    asset: activeToken,
    lrt: lrtDetails
  });

  const onlySingleAsset = !assets.length || assets.length === 1;

  const totalOut = useMemo(
    () => (
      <strong className="flex flex-row gap-2 items-center">
        {!activeToken ? (
          <Skeleton width={40} />
        ) : (
          <>
            {amount
              ? displayEthAmount(formatUnits(amount, activeToken.decimals))
              : displayEthAmount(formatUnits(BigInt(0), activeToken.decimals))}
          </>
        )}
        <span
          className={cn(
            twJoin(
              'bg-[var(--color-element-wrapper-bg)] rounded-[4px] px-2 py-1',
              'text-[12px] min-w-[60px] text-center block',
              !activeToken && 'px-0 py-0 h-[26px]'
            )
          )}
        >
          {activeToken?.symbol || <Skeleton className="w-full h-full" />}
        </span>
      </strong>
    ),
    [amount, activeToken]
  );

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Exchange rate</span>
          {!exchangeRate ? (
            <Skeleton height="0.875rem" width={80} />
          ) : (
            <strong className="text-right">
              1.00 reETH = {(1 / exchangeRate?.lrt).toLocaleString()}{' '}
              {activeToken?.symbol || <Skeleton width={20} />}{' '}
              <span className="text-right font-bold opacity-50">
                ($
                {(exchangeRate.usd * (1 / exchangeRate?.lrt))?.toLocaleString()}
                )
              </span>
            </strong>
          )}
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Fees</span>
          <strong>Free</strong>
        </div>
      </div>
      <HR />
      {onlySingleAsset ? (
        <div className="text-[14px] space-y-2 mt-4">
          <strong>Estimated amount</strong>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-[6px] w-full">
              {!activeToken ? (
                <>
                  <Skeleton width={20} height={20} />
                  <Skeleton className="text-[14px] w-[70%] bold lg:w-full truncate" />
                </>
              ) : (
                <>
                  <Image
                    src={activeToken.logo}
                    alt={`${activeToken.name} logo`}
                    width={20}
                    height={20}
                  />

                  <p className="opacity-50 text-[14px] w-[70%] bold lg:w-full truncate">
                    {activeToken?.name}
                  </p>
                </>
              )}
            </div>
            {totalOut}
          </div>
        </div>
      ) : (
        <div className="flex justify-between text-[14px] mt-4">
          <strong>Estimated amount</strong>
          {totalOut}
        </div>
      )}
    </div>
  );
};

export default WithdrawItemized;
