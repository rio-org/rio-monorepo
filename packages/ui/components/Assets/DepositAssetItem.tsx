import React, { useCallback } from 'react';
import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import AssetItemContent from './AssetItemContent';
import { useAccountIfMounted } from '../../hooks/useAccountIfMounted';
import { cn, displayEthAmount } from '../../lib/utilities';
import { AssetDetails } from '../../lib/typings';

type Props = {
  asset: AssetDetails;
  isActiveToken: boolean;
  setActiveToken: (asset: AssetDetails) => void;
  setIsListOpen: (isOpen: boolean) => void;
};

const DepositAssetItem = ({
  asset,
  isActiveToken,
  setActiveToken,
  setIsListOpen
}: Props) => {
  const { address } = useAccountIfMounted();
  const { data, isLoading, isError } = useBalance({
    address: address,
    token: asset.address
      ? asset.symbol === 'ETH'
        ? undefined
        : asset.address
      : undefined
  });
  const amount = data && (
    <>{displayEthAmount(formatUnits(data.value, data.decimals))}</>
  );
  const handleClick = useCallback((asset: AssetDetails) => {
    setActiveToken(asset);
    setIsListOpen(false);
  }, []);

  return (
    <button
      onClick={() => handleClick(asset)}
      disabled={isError}
      className={cn(
        'flex flex-row gap-2 w-full py-2 px-4 rounded-xl bg-transparent transition-colors duration-200 items-center',
        !isError && 'hover:bg-foregroundA1',
        isError && 'opacity-40'
      )}
    >
      <AssetItemContent
        asset={asset}
        isActiveToken={isActiveToken}
        isLoading={isLoading}
        isError={isError}
        amount={amount}
      />
    </button>
  );
};

export default DepositAssetItem;
