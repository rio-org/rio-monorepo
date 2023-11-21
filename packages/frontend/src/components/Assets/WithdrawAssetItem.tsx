import React from 'react';
import { TokenSymbol, AssetDetails } from '../../lib/typings';
import cx from 'classnames';
import AssetItemContent from './AssetItemContent';
import Skeleton from 'react-loading-skeleton';
import { reEthInUSD } from '../../../placeholder';
import { useFetchDummyData } from '../../hooks/useFetchDummyData';
type Props = {
  asset: AssetDetails;
  isActiveToken: boolean;
  isBestRate: boolean;
  setActiveTokenSymbol: (symbol: TokenSymbol) => void;
  setIsListOpen: (isOpen: boolean) => void;
};

const WithdrawAssetItem = ({
  asset,
  isActiveToken,
  isBestRate,
  setActiveTokenSymbol,
  setIsListOpen
}: Props) => {
  const handleClick = (symbol: TokenSymbol) => {
    setActiveTokenSymbol(symbol);
    setIsListOpen(false);
  };
  const {
    isLoading,
    isError,
    data: reETHConversionAmount
  } = useFetchDummyData();
  const amount = (
    <>
      {!isLoading && reETHConversionAmount ? (
        <>
          <strong className="text-[14px]">
            1 reETH = {reETHConversionAmount} ＊ETH
          </strong>
          <span className="text-[14px] opacity-50">(${reEthInUSD})</span>
        </>
      ) : (
        <Skeleton inline width={100} />
      )}
    </>
  );

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
        isBestRate={isBestRate}
        amount={amount}
      />
    </button>
  );
};

export default WithdrawAssetItem;
