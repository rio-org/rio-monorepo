import React from 'react';
import { ASSETS } from '../../lib/constants';
import DepositAssetItem from '../Assets/DepositAssetItem';
import { TokenSymbol } from '../../lib/typings';

type Props = {
  activeTokenSymbol: TokenSymbol;
  setActiveTokenSymbol: (symbol: TokenSymbol) => void;
  setIsListOpen: (isOpen: boolean) => void;
};

const AssetList = ({
  activeTokenSymbol,
  setActiveTokenSymbol,
  setIsListOpen
}: Props) => {
  return (
    <>
      {Object.values(ASSETS).map((asset, i) => {
        // don't display reETH or ＊ETH in the asset selector
        if (asset.symbol === 'reETH' || asset.symbol === '＊ETH') return null;
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
    </>
  );
};

export default AssetList;
