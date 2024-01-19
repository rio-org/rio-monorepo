import React from 'react';
import DepositAssetItem from '@rio-monorepo/ui/components/Assets/DepositAssetItem';
import { AssetDetails, TokenSymbol } from '@rio-monorepo/ui/lib/typings';

type Props = {
  activeTokenSymbol?: TokenSymbol;
  assets: AssetDetails[];
  setActiveToken: (asset: AssetDetails) => void;
  setIsListOpen: (isOpen: boolean) => void;
};

const AssetList = ({
  activeTokenSymbol,
  assets,
  setActiveToken,
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
            setActiveToken={setActiveToken}
            setIsListOpen={setIsListOpen}
          />
        );
      })}
    </>
  );
};

export default AssetList;
