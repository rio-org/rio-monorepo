import React from 'react';
import HR from '../Shared/HR';
import { AssetDetails } from '../../lib/typings';
import { formatUnits } from 'viem';
import { displayEthAmount } from '../../lib/utilities';
import { twJoin } from 'tailwind-merge';
import Image from 'next/image';
import { useAssetPriceUsd } from '../../hooks/useAssetPriceUsd';

type Props = {
  activeToken: AssetDetails;
  amount: bigint | null | undefined;
  assets: AssetDetails[];
};

const WithdrawItemized = ({ assets, amount, activeToken }: Props) => {
  // const [isExpanded, setIsExpanded] = React.useState(true);
  // const assets = buildAssetList(activeToken.symbol);
  const assetPriceUsd = useAssetPriceUsd(activeToken.address);

  // TODO: Get actual exchange rate
  const lrtAssetExchangeRate = 1.02;

  const onlySingleAsset = assets.length === 1;

  const totalOut = (
    <strong className="flex flex-row gap-2 items-center">
      {amount
        ? displayEthAmount(formatUnits(amount, activeToken.decimals))
        : displayEthAmount(formatUnits(BigInt(0), activeToken.decimals))}
      <span
        className={twJoin(
          'bg-[var(--color-element-wrapper-bg)] rounded-[4px] px-2 py-1',
          'text-[12px] min-w-[60px] text-center block'
        )}
      >
        {activeToken.symbol}
      </span>
    </strong>
  );

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Exchange rate</span>
          <strong className="text-right">
            1.00 reETH = {lrtAssetExchangeRate} {activeToken.symbol}{' '}
            <span className="text-right font-bold opacity-50">
              ($
              {assetPriceUsd
                ? (assetPriceUsd * lrtAssetExchangeRate)?.toLocaleString()
                : '0.00'}
              )
            </span>
          </strong>
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
              <Image
                src={activeToken.logo}
                alt={`${activeToken.name} logo`}
                width={20}
                height={20}
              />
              <p className="opacity-50 text-[14px] w-[70%] bold lg:w-full truncate">
                {activeToken.name}
              </p>
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
