import React from 'react';
import DepositAssetItem from '../Assets/DepositAssetItem';
import { AssetDetails, TokenSymbol } from '../../lib/typings';

type Props = {
  activeTokenSymbol: TokenSymbol;
  assets: AssetDetails[];
  setActiveTokenSymbol: (symbol: TokenSymbol) => void;
  setIsListOpen: (isOpen: boolean) => void;
};

const AssetList = ({
  activeTokenSymbol,
  assets,
  setActiveTokenSymbol,
  setIsListOpen
}: Props) => {
  return (
    <>
      {assets.map((asset, i) => {
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
