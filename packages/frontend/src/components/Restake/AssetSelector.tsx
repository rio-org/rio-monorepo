import React from 'react';
import { TokenSymbol } from '../../lib/typings';
import { ASSETS } from '../../lib/constants';
import Image from 'next/image';
import DepositAssetItem from '../Assets/DepositAssetItem';
import IconSelectArrow from '../Icons/IconSelectArrow';
import cx from 'classnames';

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
        className={cx(
          'flex flex-row gap-1 justify-center items-center py-1 pl-1 pr-3 rounded-full bg-[var(--color-element-wrapper-bg-light)] duration-200 hover:bg-[var(--color-element-wrapper-bg-light-hover)] transition-colors',
          isListOpen && 'bg-[var(--color-element-wrapper-bg-light-hover)]'
        )}
      >
        <Image
          src={ASSETS[activeTokenSymbol].logo}
          alt={`${ASSETS[activeTokenSymbol].name} logo`}
          width={24}
          height={24}
        />
        <span className="pr-2">{activeTokenSymbol}</span>
        <div className="w-fit flex-none">
          <IconSelectArrow direction={isListOpen ? 'up' : 'down'} />
        </div>
      </button>
      {isListOpen && (
        <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white rounded-xl shadow-xl z-10 overflow-y-auto p-[2px] h-fit">
          {Object.values(ASSETS).map((asset, i) => {
            // don't display reETH or ＊ETH in the asset selector
            if (asset.symbol === 'reETH' || asset.symbol === '＊ETH')
              return null;
            return (
              <DepositAssetItem
                asset={asset}
                key={i}
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
