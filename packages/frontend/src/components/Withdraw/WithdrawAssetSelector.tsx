import React, { useEffect, useState } from 'react';
import { Asset, AssetDetails, TokenSymbol } from '../../lib/typings';
import { ASSETS } from '../../lib/constants';
import AssetItemContent from '../Assets/AssetItemContent';
import WithdrawAssetItem from '../Assets/WithdrawAssetItem';
import IconSelectArrow from '../Icons/IconSelectArrow';
import cx from 'classnames';

type Props = {
  activeTokenSymbol: TokenSymbol;
  setActiveTokenSymbol: (symbol: TokenSymbol) => void;
};

const WithdrawAssetSelector = ({ activeTokenSymbol, setActiveTokenSymbol }: Props) => {
  const [isListOpen, setIsListOpen] = useState(false);
  return (
    <div className='relative'>
      <div>
        <label htmlFor="asset" className="block mb-1 font-medium">
          Select asset
        </label>
        <button
          className={cx(
            "flex flex-row gap-4 items-center w-full text-left bg-black bg-opacity-5 text-black px-[20px] py-4 rounded-xl border border-transparent hover:border-gray-300",
            isListOpen && 'border-gray-300',
          )}
          id="asset"
          onClick={() => setIsListOpen(!isListOpen)}
        >
          <AssetItemContent
            asset={ASSETS[activeTokenSymbol]}
            isActiveToken={false}
            isLoading={false}
            isError={false}
            amount={<></>}
          />
          <IconSelectArrow direction={isListOpen ? 'up' : 'down'} />
        </button>
      </div>

      {isListOpen && (
        <div
          className="absolute top-[calc(100%+10px)] left-0 w-full bg-white rounded-xl shadow-xl z-10 overflow-y-auto p-[2px] h-fit"
        >
          {Object.values(ASSETS).map((asset) => {
            // don't display reETH in the asset selector
            if (asset.symbol === 'reETH') return null;
            return (
              <WithdrawAssetItem
                asset={asset}
                key={asset.symbol}
                isActiveToken={asset.symbol === activeTokenSymbol}
                setActiveTokenSymbol={setActiveTokenSymbol}
                setIsListOpen={setIsListOpen}
                isBestRate={asset.symbol === '＊ETH' ? true : false} // todo: make dynamic
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WithdrawAssetSelector;
