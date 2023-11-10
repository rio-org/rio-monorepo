import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useGetProposals } from '../hooks/useGetProposals';
import { useNetwork } from 'wagmi';
import { CHAIN_ID_NUMBER } from '../lib/typings';
import OnchainDataExample from '../components/Examples/OnchainDataExample';
import OnChainDataViemExample from '../components/Examples/OnChainDataViemExample';
import Skeleton from 'react-loading-skeleton';

const Home: NextPage = () => {
  const testCollectionAddress = '0xdf9b7d26c8fc806b1ae6273684556761ff02d422'; // builder dao
  const testTxHash =
    '0x8fd7e9f06e2120c32f732c95fe3834d7848cd3344cd6c888a971fee1d2fdd138';
  const [chainId, setChainId] = useState<CHAIN_ID_NUMBER>(1);
  const { chain } = useNetwork();
  const testPropCount = 10;
  const testProposalsList = useGetProposals(testCollectionAddress, chainId, 10);

  useEffect(() => {
    if (chain) {
      setChainId(chain.id as CHAIN_ID_NUMBER);
    }
  }, [chain]);

  return (
    <>
      <h2 className="text-2xl">
        <span>onchain data (wagmi)</span>
      </h2>

      <OnchainDataExample
        collectionAddress={testCollectionAddress}
        chainId={chainId}
      />

      <hr className="my-8" />

      <h2 className="text-2xl mb-2">
        sample onchain data fetching (via viem client)
      </h2>

      <OnChainDataViemExample txHash={testTxHash} chainId={chainId} />

      <hr className="my-8" />

      <h2 className="text-2xl mb-2">subgraph data</h2>

      <ul>
        {testProposalsList.isLoading &&
          [...Array(testPropCount)].map((_, i) => (
            <li className="mb-2 text-sm font-bold" key={i}>
              <Skeleton />
            </li>
          ))}
        {testProposalsList.data?.map((proposal, i) => {
          return (
            <li className="mb-2 text-sm font-bold" key={i}>
              {proposal.title}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Home;
