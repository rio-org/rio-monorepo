import React from 'react';
import { TokenSymbol } from '../../lib/typings';
import { ASSETS } from '../../lib/constants';
import Image from 'next/image';
import DepositAssetItem from '../Assets/DepositAssetItem';

type Props = {
  activeTokenSymbol: TokenSymbol;
  setActiveTokenSymbol: (symbol: TokenSymbol) => void;
};

const AssetSelector = ({ activeTokenSymbol, setActiveTokenSymbol }: Props) => {
  const [isListOpen, setIsListOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsListOpen(!isListOpen)}
        className="flex flex-row gap-1 py-2 px-2 rounded-xl bg-transparent hover:bg-[var(--color-element-wrapper-bg)] transition-colors duration-200"
      >
        <Image
          src={ASSETS[activeTokenSymbol].logo}
          alt={`${ASSETS[activeTokenSymbol].name} logo`}
          width={24}
          height={24}
        />
        <span className="pr-6">{activeTokenSymbol}</span>
      </button>
      {isListOpen && (
        <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white rounded-xl shadow-xl z-10 overflow-y-auto p-[2px] h-fit">
          {Object.values(ASSETS).map((asset) => {
            // don't display reETH or ＊ETH in the asset selector
            if (asset.symbol === 'reETH' || asset.symbol === '＊ETH') return null;
            return (
              <DepositAssetItem
                asset={asset}
                key={asset.symbol}
                isActiveToken={asset.symbol === activeTokenSymbol}
                setActiveTokenSymbol={setActiveTokenSymbol}
                setIsListOpen={setIsListOpen}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default AssetSelector;
