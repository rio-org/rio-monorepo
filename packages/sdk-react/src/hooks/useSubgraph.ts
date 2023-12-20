import { SubgraphClient } from '@rionetwork/sdk';
import { RioNetworkContext } from '../components/index.js';
import { useContext } from 'react';

export const useSubgraph = (): SubgraphClient => {
  const rioNetwork = useContext(RioNetworkContext);
  if (!rioNetwork) {
    throw new Error(
      `You must provide a RioNetwork instance via the RioNetworkProvider`
    );
  }
  return rioNetwork.subgraphClient;
};
