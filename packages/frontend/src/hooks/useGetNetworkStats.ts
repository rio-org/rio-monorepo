import { EthereumAddress, NetworkStats } from '../lib/typings';
import { useContractReads } from 'wagmi';
import { BuilderTokenAbi } from '../abi/BuilderTokenAbi';
import { apr, demoReadContractAddress, tvl } from '../../placeholder';
import { useEffect, useState } from 'react';

export const useGetNetworkStats = () => {
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>();

  const contractConfig = {
    address: demoReadContractAddress as EthereumAddress,
    abi: BuilderTokenAbi
  };

  const { data, isLoading, isError } = useContractReads({
    contracts: [
      {
        ...contractConfig,
        functionName: 'totalSupply'
      },
      {
        ...contractConfig,
        functionName: 'getVotes',
        args: ['0xCB43078C32423F5348Cab5885911C3B5faE217F9'] // ripe's address for demo purposes
      }
    ]
  });

  useEffect(() => {
    setNetworkStats({
      tvl: Math.trunc(tvl),
      apr: apr
    });
  }, [data]);

  console.log(data, isLoading, isError);

  return {
    networkStats,
    isLoading,
    isError
  };
};
