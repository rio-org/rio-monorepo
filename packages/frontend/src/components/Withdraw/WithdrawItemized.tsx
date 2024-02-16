import Skeleton from 'react-loading-skeleton';
import { formatUnits } from 'viem';
import { useMemo } from 'react';
import Image from 'next/image';
import { RestakingTokenExchangeRate } from '@rio-monorepo/ui/components/Shared/RestakingTokenExchangeRate';
import { InfoTooltip } from '@rio-monorepo/ui/components/Shared/InfoTooltip';
import HR from '@rio-monorepo/ui/components/Shared/HR';
import { displayEthAmount } from '@rio-monorepo/ui/lib/utilities';
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
          <RestakingTokenExchangeRate
            assetSymbol={activeToken?.symbol}
            restakingTokenSymbol={lrtDetails?.symbol}
            defaultRateDenominator="restakingToken"
          />
        </div>
        <div className="flex justify-between">
          <span className="flex items-center text-black gap-1">
            <span className="opacity-50 text-[14px]">Delay</span>

            <InfoTooltip align="center" contentClassName="max-w-[300px] p-3">
              <p>
                The waiting period for your funds to be claimable after making a
                withdrawal request.
              </p>
            </InfoTooltip>
          </span>
          <strong className="text-right text-[14px]">1-8 Days</strong>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center text-black gap-1">
            <span className="opacity-50 text-[14px]">Withdrawal fees</span>

            <InfoTooltip align="center" contentClassName="max-w-[300px] p-3">
              <p>Fees applied when funds are withdrawn from the Rio Network.</p>
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
