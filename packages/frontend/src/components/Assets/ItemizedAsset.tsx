import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { IconCheck } from '../Icons/IconCheck';
import InlineErrorMessage from '../Shared/InlineErrorMessage';
import Image from 'next/image';
import { AssetDetails } from '../../lib/typings';
import SymbolPill from '../Shared/SymbolPill';

type Props = {
  asset: AssetDetails;
  isActiveToken: boolean;
  isLoading: boolean;
  isError: boolean;
  amount: number;
};

const ItemizedAsset = ({
  asset,
  isActiveToken,
  isLoading,
  isError,
  amount
}: Props) => {
  return (
    <div className="flex flex-row justify-between items-center w-full text-left">
      <div className="flex flex-row items-center gap-[6px] w-full">
        <Image
          src={asset.logo}
          alt={`${asset.name} logo`}
          width={20}
          height={20}
        />
        <p className="opacity-50 text-[14px] w-[70%] lg:w-full truncate">
          {asset.name}
        </p>
      </div>
      <p className="flex gap-2 items-center justify-center content-center text-[14px]">
        {amount > 0 ? amount.toFixed(2) : '0.00'}
        <SymbolPill symbol={asset.symbol} />
        {isLoading && <Skeleton width={60} />}
        {isError && (
          <InlineErrorMessage>Error loading balance</InlineErrorMessage>
        )}
        {isActiveToken && <IconCheck />}
      </p>
    </div>
  );
};

export default ItemizedAsset;
