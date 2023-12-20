import React from 'react';
import { TokenSymbol, AssetDetails } from '../../lib/typings';
import cx from 'classnames';
import AssetItemContent from './AssetItemContent';
import { useAccount, useBalance } from 'wagmi';

type Props = {
  asset: AssetDetails;
  isActiveToken: boolean;
  setActiveTokenSymbol: (symbol: TokenSymbol) => void;
  setIsListOpen: (isOpen: boolean) => void;
};

const DepositAssetItem = ({
  asset,
  isActiveToken,
  setActiveTokenSymbol,
  setIsListOpen
}: Props) => {
  const { address } = useAccount();
  const { data, isLoading, isError } = useBalance({
    address: address,
    token: asset.address === null ? undefined : asset.address
  });
  const amount = data && <>{(+data?.formatted).toFixed(2)}</>;
  const handleClick = (symbol: TokenSymbol) => {
    setActiveTokenSymbol(symbol);
    setIsListOpen(false);
  };
  return (
    <button
      onClick={() => {
        handleClick(asset.symbol);
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
