import React from 'react';
import HR from '../Shared/HR';
import ItemizedAsset from '../Assets/ItemizedAsset';
import { TokenSymbol } from '../../lib/typings';
import { buildAssetList } from '../../lib/utilities';

type Props = {
  activeTokenSymbol: TokenSymbol;
};

const WithdrawItemized = ({ activeTokenSymbol }: Props) => {
  const assets = buildAssetList(activeTokenSymbol);
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Exchange rate</span>
          <strong>
            1.00 reETH = 1.02 {activeTokenSymbol}{' '}
            <span className="font-normal">($1,789.28)</span>
          </strong>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Fees</span>
          <strong>Free</strong>
        </div>
      </div>
      <HR />
      <div className="flex justify-between text-[14px]">
        <span className="text-black opacity-50">You will receive</span>
      </div>
      <div className="flex flex-col gap-3 mt-2 mb-4">
        {assets.map((asset) => {
          return (
            <ItemizedAsset
              key={asset.symbol}
              asset={asset}
              isActiveToken={false}
              isLoading={false}
              isError={false}
              amount={'0.00'}
            />
          );
        })}
      </div>
      <HR />
      <div className="flex justify-between text-[14px] mt-4">
        <strong>Total received</strong>
        <strong className="flex flex-row gap-2 items-center">
          0.00
          <span className="bg-[var(--color-element-wrapper-bg)] rounded-[4px] px-2 py-1 text-[12px] min-w-[60px] text-center block">
            {activeTokenSymbol}
          </span>
        </strong>
      </div>
    </div>
  );
};

export default WithdrawItemized;
