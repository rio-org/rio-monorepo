import React from 'react'
import { useEnsName } from 'wagmi'
import { linkToAddressOnBlockExplorer, trunc } from '../lib/utilities'
import { EthereumAddress } from '../lib/typings';

type Props = {
  address: EthereumAddress;
  chainId: number
  noLink?: boolean;
}

const ENSname = ({ address, chainId, noLink }: Props) => {
  const { data: ensName } = useEnsName({
    address: address,
    chainId: chainId,
  })

  if (noLink) {
    return (
      <span>
        {ensName || trunc(address, 6)}
      </span>
    )
  }

  return (
    <a
      href={linkToAddressOnBlockExplorer(address, chainId)}
      target='_blank'
      rel='noreferrer'
    >
      {ensName || trunc(address, 6)}
    </a>
  )
}

export default ENSname