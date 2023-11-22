import React from 'react';
import HR from '../Shared/HR';
import ItemizedAsset from '../Assets/ItemizedAsset';
import { TokenSymbol } from '../../lib/typings';
import { buildAssetList } from '../../lib/utilities';
import IconSelectArrow from '../Icons/IconSelectArrow';
import { motion } from 'framer-motion';

type Props = {
  activeTokenSymbol: TokenSymbol;
};

const WithdrawItemized = ({ activeTokenSymbol }: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const assets = buildAssetList(activeTokenSymbol);
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Exchange rate</span>
          <strong className="text-right">
            1.00 reETH = 1.02 {activeTokenSymbol}{' '}
            <span className="font-normal text-right">($1,789.28)</span>
          </strong>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-black opacity-50">Fees</span>
          <strong>Free</strong>
        </div>
      </div>
      <HR />
      <div
        className="flex justify-between items-center text-[14px]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-black opacity-50">You will receive</span>
        <span className='lg:hidden'>
          <IconSelectArrow direction={isExpanded ? 'up' : 'down'} />
        </span>
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className='flex flex-col gap-3 mt-2 mb-4'>
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
      </motion.div>
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
