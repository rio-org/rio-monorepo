import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { IconCheck } from '../Icons/IconCheck';
import InlineErrorMessage from '../Shared/InlineErrorMessage';
import Image from 'next/image';
import { AssetDetails } from '../../lib/typings';
import BestRateLabel from './BestRateLabel';

type Props = {
  asset: AssetDetails;
  isActiveToken: boolean;
  isLoading: boolean;
  isError: boolean;
  isBestRate?: boolean;
  amount: React.ReactNode;
};

const AssetItemContent = ({
  asset,
  isActiveToken,
  isLoading,
  isError,
  isBestRate,
  amount
}: Props) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      <Image
        src={asset.logo}
        alt={`${asset.name} logo`}
        width={24}
        height={24}
      />
      <div className="flex flex-row justify-between items-center w-full text-left">
        <div>
          <h3 className="font-medium">
            {asset.symbol}
            {isBestRate && <BestRateLabel />}
          </h3>
          <p className="opacity-50 text-[14px]">{asset.name}</p>
        </div>
        <p className="flex gap-2 items-center justify-center content-center">
          {hasMounted && amount}
          {isLoading && <Skeleton width={60} />}
          {isError && (
            <InlineErrorMessage>Error loading balance</InlineErrorMessage>
          )}
          {isActiveToken && <IconCheck />}
        </p>
      </div>
    </>
  );
};

export default AssetItemContent;
