import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { IconCheck } from '../Icons/IconCheck';
import InlineErrorMessage from '../Shared/InlineErrorMessage';
import Image from 'next/image';
import { AssetDetails } from '../../lib/typings';
import BestRateLabel from './BestRateLabel';
import cx from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { DESKTOP_MQ } from '../../lib/constants';
import { useGetLatestAssetPrice } from '../../hooks/useGetLatestAssetPrice';
import { CHAIN_ID } from '../../../config';

type Props = {
  asset: AssetDetails;
  isActiveToken: boolean;
  isLoading: boolean;
  isError: boolean;
  amount: React.ReactNode;
  isBestRate?: boolean;
  isSelectorDisplay?: boolean;
};

const AssetItemContent = ({
  asset,
  isActiveToken,
  isLoading,
  isError,
  isBestRate,
  amount,
  isSelectorDisplay
}: Props) => {
  useGetLatestAssetPrice(asset.address, CHAIN_ID);
  const isDesktopOrLaptop = useMediaQuery({
    query: DESKTOP_MQ
  });
  return (
    <>
      <Image
        src={asset.logo}
        alt={`${asset.name} logo`}
        width={46}
        height={46}
        className={cx(
          'w-[32px] h-[32px] lg:w-[24px] lg:h-[24px]',
          asset.symbol === '＊ETH' && '!w-[46px] !h-[46px] -ml-[12px] mt-2', // if *eth, make image larger to account for shadow in logo
          isSelectorDisplay && asset.symbol === '＊ETH' && '!ml-0'
        )}
      />
      {isSelectorDisplay || isDesktopOrLaptop ? (
        <div className="flex flex-row justify-between items-center w-full text-left">
          <div>
            <h3 className="font-medium">
              {asset.symbol}
              {isBestRate && (
                <span className="ml-2">
                  <BestRateLabel />
                </span>
              )}
            </h3>
            <p className="opacity-50 text-[14px]">{asset.name}</p>
          </div>
          <p className="flex gap-2 items-center justify-center content-center">
            {amount}
            {isLoading && <Skeleton width={60} />}
            {isError && (
              <InlineErrorMessage>Error loading balance</InlineErrorMessage>
            )}
            {isActiveToken && <IconCheck />}
          </p>
        </div>
      ) : (
        <div className="flex flex-row justify-between items-center w-full text-left">
          <div>
            {isBestRate && <BestRateLabel />}
            <h3 className="font-medium">
              {asset.symbol}{' '}
              <span className="opacity-50 text-[14px]">{asset.name}</span>
            </h3>
            <p className="flex gap-2">
              {amount}
              {isLoading && <Skeleton width={60} />}
              {isError && (
                <InlineErrorMessage>Error loading balance</InlineErrorMessage>
              )}
            </p>
          </div>
          <p className="flex gap-2 items-center justify-center content-center">
            {isActiveToken && <IconCheck />}
          </p>
        </div>
      )}
    </>
  );
};

export default AssetItemContent;
