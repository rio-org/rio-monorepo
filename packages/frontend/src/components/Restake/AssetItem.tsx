import React, { useEffect, useState } from 'react';
import { TokenSymbol, AssetDetails } from '../../lib/typings';
import { useAccount, useBalance } from 'wagmi';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import { IconCheck } from '../Icons/IconCheck';

type Props = {
  asset: AssetDetails;
  isActiveToken: boolean;
  setActiveTokenSymbol: (symbol: TokenSymbol) => void;
  setIsListOpen: (isOpen: boolean) => void;
};

const AssetItem = ({
  asset,
  isActiveToken,
  setActiveTokenSymbol,
  setIsListOpen
}: Props) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { address } = useAccount();
  const { data } = useBalance({
    address: address,
    token: asset.symbol === 'ETH' ? undefined : asset.address
  });

  const handleClick = (symbol: TokenSymbol) => {
    setActiveTokenSymbol(symbol);
    setIsListOpen(false);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <button
      onClick={() => {
        handleClick(asset.symbol);
      }}
      className="flex flex-row gap-2 w-full py-2 px-4 rounded-xl bg-transparent hover:bg-[var(--color-element-wrapper-bg)] transition-colors duration-200 items-center"
    >
      <Image
        src={asset.logo}
        alt={`${asset.name} logo`}
        width={24}
        height={24}
      />
      <div className="flex flex-row justify-between items-center w-full text-left">
        <div>
          <h3 className="font-medium">{asset.name}</h3>
          <p className="opacity-50 text-[14px]">{asset.symbol}</p>
        </div>
        <p className="flex gap-2 items-center justify-center content-center">
          {hasMounted && data ? (
            <>{(+data?.formatted).toFixed(2)}</>
          ) : (
            <Skeleton width={60} />
          )}
          {isActiveToken && <IconCheck />}
        </p>
      </div>
    </button>
  );
};

export default AssetItem;
