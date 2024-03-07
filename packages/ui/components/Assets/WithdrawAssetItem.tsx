import React from 'react';
import { AssetDetails } from '../../lib/typings';
import cx from 'classnames';
import AssetItemContent from './AssetItemContent';
import Skeleton from 'react-loading-skeleton';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';
import { useGetLatestAssetPrice } from '../../hooks/useGetLatestAssetPrice';
import { CHAIN_ID } from '../../config';

type Props = {
  token: AssetDetails;
  isActiveToken: boolean;
  isBestRate: boolean;
  setActiveToken: (token: AssetDetails) => void;
  setIsListOpen: (isOpen: boolean) => void;
};

const WithdrawAssetItem = ({
  token,
  isActiveToken,
  isBestRate,
  setActiveToken,
  setIsListOpen
}: Props) => {
  const { data, isLoading, isError } = useGetLatestAssetPrice({
    tokenAddress: token.address,
    chainId: CHAIN_ID
  });
  const handleClick = (token: AssetDetails) => {
    setActiveToken(token);
    setIsListOpen(false);
  };

  const reETHConversionAmount = 1.02; // TODO: get this from the API
  const amount = (
    <>
      {!isLoading && data && reETHConversionAmount ? (
        <>
          <strong className="text-[14px]">
            1 reETH = {reETHConversionAmount} {token.symbol}
          </strong>
          <span className="text-[14px] opacity-50 font-bold">
            (${(data.latestUSDPrice || 0) * reETHConversionAmount})
          </span>
        </>
      ) : (
        <Skeleton inline width={100} />
      )}
    </>
  );

  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });

  return (
    <button
      onClick={() => {
        handleClick(token);
      }}
      disabled={isError ? true : false}
      className={cx(
        'flex flex-row gap-2 w-full py-3 lg:py-2 px-4 rounded-xl bg-transparent transition-colors duration-200 items-center',
        !isError && 'hover:bg-foregroundA1',
        isError && 'opacity-40',
        isDesktopOrLaptop ? 'gap-2' : 'gap-4'
      )}
    >
      <AssetItemContent
        asset={token}
        isActiveToken={isActiveToken}
        isLoading={isLoading}
        isError={isError ? true : false}
        isBestRate={isBestRate}
        amount={amount}
      />
    </button>
  );
};

export default WithdrawAssetItem;
