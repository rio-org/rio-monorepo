import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { IconCheck } from '../Icons/IconCheck'
import InlineErrorMessage from '../Shared/InlineErrorMessage'
import Image from 'next/image'
import { AssetDetails } from '../../lib/typings'

type Props = {
  asset: AssetDetails;
  isActiveToken: boolean;
  isLoading: boolean;
  isError: boolean;
  isBestRate?: boolean;
  amount: string;
}

const ItemizedAsset = ({ asset, isActiveToken, isLoading, isError, isBestRate, amount }: Props) => {
  return (
    <div className="flex flex-row justify-between items-center w-full text-left">
      <div className="flex flex-row items-center gap-[6px]">
        <Image
          src={asset.logo}
          alt={`${asset.name} logo`}
          width={20}
          height={20}
        />
        <p className="opacity-50 text-[14px]">{asset.name}</p>
      </div>
      <p className="flex gap-2 items-center justify-center content-center">
        {amount}
        <span className='bg-[var(--color-element-wrapper-bg)] rounded-[4px] px-2 py-1 text-[12px] min-w-[60px] text-center block'>
          {asset.symbol}
        </span>
        {isLoading && (
          <Skeleton width={60} />
        )}
        {isError && (
          <InlineErrorMessage>
            Error loading balance
          </InlineErrorMessage>
        )}
        {isActiveToken && <IconCheck />}
      </p>
    </div>
  )
}

export default ItemizedAsset