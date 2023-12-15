import React from 'react';
import HR from '../Shared/HR';
import { AssetDetails } from '../../lib/typings';
import { formatUnits } from 'viem';

type Props = {
  activeToken: AssetDetails;
  amount: bigint | null;
};

const WithdrawItemized = ({ amount, activeToken }: Props) => {
  // const [isExpanded, setIsExpanded] = React.useState(true);
  // const assets = buildAssetList(activeToken.symbol);
  const amountNum = amount ? +formatUnits(amount, activeToken.decimals) : 0;
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Exchange rate</span>
          <strong className="text-right">
            1.00 reETH = 1.02 {activeToken.symbol}{' '}
            <span className="font-normal text-right">($1,789.28)</span>
          </strong>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Fees</span>
          <strong>Free</strong>
        </div>
      </div>
      {/* removed distributed list until multiple-token withdrawals are active */}
      {/* <HR />
      <div
        className="flex justify-between items-center text-[14px]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-black opacity-50">You will receive</span>
        <span className="lg:hidden">
          <IconSelectArrow direction={isExpanded ? 'up' : 'down'} />
        </span>
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="flex flex-col gap-3 mt-2 mb-4">
          {assets.map((asset) => {
            return (
              <ItemizedAsset
                key={asset.symbol}
                asset={asset}
                isActiveToken={false}
                isLoading={false}
                isError={false}
                amount={amountNum / 5}
              />
            );
          })}
        </div>
      </motion.div> */}
      <HR />
      <div className="flex justify-between text-[14px] mt-4">
        <strong>Total received</strong>
        <strong className="flex flex-row gap-2 items-center">
          {amountNum.toFixed(2)}
          <span className="bg-[var(--color-element-wrapper-bg)] rounded-[4px] px-2 py-1 text-[12px] min-w-[60px] text-center block">
            {activeToken.symbol}
          </span>
        </strong>
      </div>
    </div>
  );
};

export default WithdrawItemized;
