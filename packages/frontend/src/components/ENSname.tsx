import React from 'react';
import { useEnsName } from 'wagmi';
import { linkToAddressOnBlockExplorer, trunc } from '../lib/utilities';
import { EthereumAddress } from '../lib/typings';
import { CHAIN_ID } from '../../config';

type Props = {
  address: EthereumAddress;
  noLink?: boolean;
};

const ENSname = ({ address, noLink }: Props) => {
  const { data: ensName } = useEnsName({
    address: address
  });

  if (noLink) {
    return <span>{ensName || trunc(address, 6)}</span>;
  }

  return (
    <a
      href={linkToAddressOnBlockExplorer(address, CHAIN_ID)}
      target="_blank"
      rel="noreferrer"
    >
      {ensName || trunc(address, 6)}
    </a>
  );
};

export default ENSname;
