import React, { useEffect, useState } from 'react';
import { TokenSymbol, AssetDetails } from '../../lib/typings';
import cx from 'classnames';
import AssetItemContent from './AssetItemContent';
import Skeleton from 'react-loading-skeleton';

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
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reETHConversionAmount, setReETHConversionAmount] = useState<number | null>(null);
  const handleClick = (symbol: TokenSymbol) => {
    setActiveTokenSymbol(symbol);
    setIsListOpen(false);
  };

  const fetchDummyData = async () => {
    //  wait 1 second before setting isError to true
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setReETHConversionAmount(1.05);
    setIsLoading(false);
    setIsError(false);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchDummyData();
  }, []);

  const amount = <>{
    reETHConversionAmount ?
      <>
        <strong className='text-[14px]'>
          1 reETH = {reETHConversionAmount} ＊ETH
        </strong>
        <span className='text-[14px] opacity-50'>($1,828.51)</span>
      </> :
      <Skeleton inline width={100} />
  }</>;

  return (
    <button
      onClick={() => {
        handleClick(asset.symbol);
      }}
      disabled={isError}
      className={cx(
        "flex flex-row gap-2 w-full py-2 px-4 rounded-xl bg-transparent transition-colors duration-200 items-center",
        !isError && 'hover:bg-[var(--color-element-wrapper-bg)]',
        isError && 'opacity-40'
      )}
    >
      <AssetItemContent
        asset={asset}
        isActiveToken={isActiveToken}
        isLoading={false}
        isError={isError}
        isBestRate={isBestRate}
        amount={amount}
      />
    </button>
  );
};

export default WithdrawAssetItem;
