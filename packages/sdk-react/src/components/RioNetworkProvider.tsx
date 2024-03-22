import {
  Address,
  LiquidRestakingTokenClient,
  SubgraphClient
} from '@rionetwork/sdk';
import React, { createContext, useEffect, useState } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';

export interface RioNetwork {
  subgraphClient: SubgraphClient;
  restakingTokenClients: Record<Address, LiquidRestakingTokenClient>;
  populateLiquidRestakingTokenClient: (
    address: Address
  ) => Promise<LiquidRestakingTokenClient>;
}

export type RioNetworkProps = {
  children: React.ReactNode;
  subgraphUrl?: string;
  graphApiKey?: string;
};

export const RioNetworkContext = createContext<RioNetwork | undefined>(
  undefined
);

export const RioNetworkProvider: React.FC<RioNetworkProps> = ({
  children,
  subgraphUrl,
  graphApiKey
}: RioNetworkProps) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [subgraphClient, setSubgraphClient] = useState<SubgraphClient>(
    new SubgraphClient(publicClient.chain.id, { subgraphUrl, graphApiKey })
  );
  const [restakingTokenClients, setRestakingTokenClients] = useState<
    Record<Address, LiquidRestakingTokenClient>
  >({});

  const populateLiquidRestakingTokenClient = async (address: Address) => {
    let client = restakingTokenClients[address];
    if (!client) {
      client = new LiquidRestakingTokenClient(
        address,
        publicClient,
        walletClient ?? undefined,
        { subgraphUrl, graphApiKey }
      );
      setRestakingTokenClients((clients) => ({
        ...clients,
        [address]: client
      }));

      await client.populate();
    }
    return client;
  };

  useEffect(() => {
    if (
      !Object.keys(restakingTokenClients).length ||
      (!publicClient && !walletClient)
    )
      return;

    const updatedClients = Object.entries(restakingTokenClients).reduce(
      (clients, [address, client]) => {
        client.attachPublicClient(publicClient);
        client.attachWalletClient(walletClient ?? undefined);
        client.setSubgraphClientOptions({ subgraphUrl, graphApiKey });

        clients[address] = client;
        return clients;
      },
      {} as Record<Address, LiquidRestakingTokenClient>
    );

    setSubgraphClient(
      new SubgraphClient(publicClient.chain.id, { subgraphUrl, graphApiKey })
    );
    setRestakingTokenClients(updatedClients);
  }, [publicClient, walletClient, subgraphUrl, graphApiKey]);

  const context: RioNetwork = {
    subgraphClient,
    restakingTokenClients,
    populateLiquidRestakingTokenClient
  };

  return (
    <RioNetworkContext.Provider value={context}>
      {children}
    </RioNetworkContext.Provider>
  );
};
