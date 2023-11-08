import React, { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import { BuilderTokenAbi } from '../../abi/BuilderTokenAbi';
import { CHAIN_ID_NUMBER, EthereumAddress } from '../../lib/typings';
import Skeleton from 'react-loading-skeleton';

type Props = {
  collectionAddress: string;
  chainId: CHAIN_ID_NUMBER;
};

const OnchainDataExample = ({ collectionAddress, chainId }: Props) => {
  const [fetchedData, setFetchedData] = useState<string>();
  const contractConfig = {
    address: collectionAddress as EthereumAddress,
    abi: BuilderTokenAbi,
    chainId: chainId
  };
  const { data, isError, isLoading } = useContractRead({
    ...contractConfig,
    functionName: 'name'
  });

  useEffect(() => {
    if (data) {
      setFetchedData(data);
    }
  }, [data]);

  return (
    <>
      <p>{!isError && (fetchedData || <Skeleton />)}</p>
      {isError && <p>error reading data</p>}
    </>
  );
};

export default OnchainDataExample;
