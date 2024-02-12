import Skeleton from 'react-loading-skeleton';
import { formatUnits } from 'viem';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { InfoTooltip } from '@rio-monorepo/ui/components/Shared/InfoTooltip';
import HR from '@rio-monorepo/ui/components/Shared/HR';
import { useAssetExchangeRate } from '@rio-monorepo/ui/hooks/useAssetExchangeRate';
import { useIsTouch } from '@rio-monorepo/ui/contexts/TouchProvider';
import {
  displayAmount,
  displayEthAmount
} from '@rio-monorepo/ui/lib/utilities';
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
  const isTouch = useIsTouch();
  const { data: exchangeRate } = useAssetExchangeRate({
    asset: activeToken,
    lrt: lrtDetails
  });

  const onlySingleAsset = !assets.length || assets.length === 1;
  const exchangeRateDecimals = isTouch ? [2, 2] : [3, 3];

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
        <span className="leading-none">
          {activeToken?.symbol || <Skeleton className="w-6 h-3.5" />}
        </span>
      </strong>
    ),
    [amount, activeToken]
  );

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="flex items-center whitespace-nowrap text-black gap-1">
            <span className="opacity-50 text-[14px]">Exchange rate</span>

            <InfoTooltip
              align="center"
              contentClassName="max-w-[300px] space-y-1 p-3 whitespace-normal"
            >
              <p>
                The amount of {lrtDetails?.symbol} you will receive for each{' '}
                {activeToken?.symbol} deposited.
              </p>
              <p className="opacity-75 text-xs">
                The exchange rate increases ({lrtDetails?.symbol} is worth more
                than {activeToken?.symbol}) as restaking rewards are earned and
                may decrease if there is a slashing event.
              </p>
            </InfoTooltip>
          </span>
          {!exchangeRate ? (
            <Skeleton height="0.875rem" width={80} />
          ) : (
            <span className="flex items-center gap-1 text-[14px]">
              <strong className="text-right">
                {displayAmount(1, ...exchangeRateDecimals)} {lrtDetails?.symbol}{' '}
                ={' '}
                {displayAmount(1 / exchangeRate?.lrt, ...exchangeRateDecimals)}{' '}
                {activeToken?.symbol || <Skeleton width={20} />}{' '}
                <span className="text-right font-bold opacity-50">
                  ($
                  {displayAmount(
                    exchangeRate.usd * (1 / exchangeRate?.lrt),
                    2,
                    2
                  )}
                  )
                </span>
              </strong>
              {+displayAmount(
                1 / exchangeRate?.lrt,
                ...exchangeRateDecimals
              ) !==
                1 / exchangeRate?.lrt && (
                <InfoTooltip>
                  <p>
                    <span className="font-semibold block">
                      Exact exchange rate
                    </span>
                    <span className="block">
                      {1 / exchangeRate?.lrt} {lrtDetails?.symbol}
                    </span>
                  </p>
                </InfoTooltip>
              )}
            </span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="flex items-center text-black gap-1">
            <span className="opacity-50 text-[14px]">Withdrawal fees</span>

            <InfoTooltip align="center" contentClassName="max-w-[300px] p-3">
              <p>
                The percentage taken from all staking rewards (not deposits).
              </p>
            </InfoTooltip>
          </span>
          <strong className="text-right text-[14px]">None</strong>
        </div>
      </div>
      <HR />
      {onlySingleAsset ? (
        <div className="text-[14px] space-y-2 mt-4">
          <span className="flex items-center text-black gap-1">
            <span className="font-bold text-[14px]">Estimated amount</span>

            <InfoTooltip align="center" contentClassName="max-w-[300px] p-3">
              <p>
                An estimated amount and may change based on market fluctuations,
                pending rewards and slashing events.
              </p>
            </InfoTooltip>
          </span>
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
