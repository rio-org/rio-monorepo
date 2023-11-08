import React, { useEffect, useState } from 'react';
import { TransactionReceipt } from 'viem';
import { EthereumTransactionHash, CHAIN_ID_NUMBER } from '../../lib/typings';
import { viemClient } from '../../lib/viemClient';
import Skeleton from 'react-loading-skeleton';

type Props = {
  txHash: EthereumTransactionHash;
  chainId: CHAIN_ID_NUMBER;
};

const OnChainDataViemExample = ({ txHash, chainId }: Props) => {
  const [txReceipt, setTxReceipt] = useState<TransactionReceipt>();
  const client = viemClient(chainId);

  const getReceipt = async (txHash: EthereumTransactionHash) => {
    const receipt = await client.getTransactionReceipt({
      hash: txHash
    });
    if (receipt) {
      setTxReceipt(receipt);
    }
  };

  useEffect(() => {
    if (txHash) {
      void getReceipt(txHash);
    }
  }, [txHash]);

  return (
    <div className="mb-4">
      <ul>
        <li>tx hash: {txHash}</li>
        <li>status: {txReceipt?.status ? txReceipt.status : <Skeleton />}</li>
        <li>
          blockHash: {txReceipt?.blockHash ? txReceipt.blockHash : <Skeleton />}
        </li>
      </ul>
    </div>
  );
};

export default OnChainDataViemExample;
