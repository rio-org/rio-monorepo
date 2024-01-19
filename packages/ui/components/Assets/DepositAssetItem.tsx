import React from 'react';
import { AssetDetails } from '../../lib/typings';
import cx from 'classnames';
import AssetItemContent from './AssetItemContent';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { displayEthAmount } from '../../lib/utilities';

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
  const { address } = useAccount();
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
  const handleClick = (asset: AssetDetails) => {
    setActiveToken(asset);
    setIsListOpen(false);
  };
  return (
    <button
      onClick={() => {
        handleClick(asset);
      }}
      disabled={isError}
      className={cx(
        'flex flex-row gap-2 w-full py-2 px-4 rounded-xl bg-transparent transition-colors duration-200 items-center',
        !isError && 'hover:bg-[var(--color-element-wrapper-bg)]',
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
