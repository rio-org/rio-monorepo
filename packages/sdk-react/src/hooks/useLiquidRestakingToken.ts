import { LiquidRestakingTokenClient } from '@rionetwork/sdk';
import { RioNetworkContext } from '../components/index.js';
import { useContext, useEffect } from 'react';

export const useLiquidRestakingToken = (
  address: string
): LiquidRestakingTokenClient | null => {
  const rioNetwork = useContext(RioNetworkContext);
  if (!rioNetwork) {
    throw new Error(
      `You must provide a RioNetwork instance via the RioNetworkProvider`
    );
  }

  useEffect(() => {
    if (!rioNetwork.restakingTokenClients[address]) {
      void rioNetwork.populateLiquidRestakingTokenClient(address);
    }
  }, [address]);

  return rioNetwork.restakingTokenClients[address];
};
