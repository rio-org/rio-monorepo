import '../styles/global.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import '@rainbow-me/rainbowkit/styles.css';
import {
  injectedWallet,
  argentWallet,
  trustWallet,
  rabbyWallet,
  safeWallet,
  ledgerWallet,
  braveWallet
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RioNetworkProvider } from '@rionetwork/sdk-react';
import { mainnet, sepolia, goerli } from 'wagmi/chains';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  getDefaultWallets
} from '@rainbow-me/rainbowkit';
import { ThemeProvider } from '@material-tailwind/react';
import CssBaseline from '@mui/material/CssBaseline';
import {
  CreateConnectorFn,
  fallback,
  unstable_connector,
  useConfig,
  WagmiProvider,
  WagmiProviderProps
} from 'wagmi';
import { http, type Chain } from 'viem';
import RioTransactionStoreProvider from '../contexts/RioTransactionStore';
import { RainbowKitDisclaimer } from './Shared/RainbowKitDisclaimer';
import Layout, { type LayoutProps } from './Layout';
import { theme } from '../lib/theme';
import { CHAIN_ID } from '../config';
import WalletAndTermsStoreProvider from '../contexts/WalletAndTermsStore';
import { TouchProvider } from '../contexts/TouchProvider';
import { Toaster } from './shadcn/toaster';
import { asType } from '../lib/utilities';

// Create the cache client
const queryClient = new QueryClient();

const chooseChain = (chainId: number): [Chain, ...Chain[]] => {
  if (chainId === 1) {
    return [mainnet] as [Chain, ...Chain[]];
  } else if (chainId === 5) {
    return [goerli] as [Chain, ...Chain[]];
  } else if (chainId === 11155111) {
    return [sepolia] as [Chain, ...Chain[]];
  } else {
    console.error('Invalid chain id');
    return [goerli] as [Chain, ...Chain[]];
  }
};

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   chooseChain(CHAIN_ID),
//   [
//     infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID || '' }),
//     publicProvider()
//   ],
//   { batch: { multicall: true } }
// );

interface Props extends LayoutProps {
  requireGeofence?: boolean;
  requireTerms?: boolean;
  appTitle: string;
}

type ConnectorType = ReturnType<CreateConnectorFn>['type'];

type ConnectorStoreState = {
  connector: ConnectorType | null;
  setConnector: React.Dispatch<React.SetStateAction<ConnectorType | null>>;
};

const ConnectorStore = createContext<ConnectorStoreState>({
  connector: null,
  setConnector: () => {}
});
const useConnectorStore = () => useContext(ConnectorStore);

function ProviderWrapper({ children }: { children: React.ReactNode }) {
  const [connector, setConnector] = useState<ConnectorType | null>(null);

  return (
    <ConnectorStore.Provider value={{ connector, setConnector }}>
      {children}
    </ConnectorStore.Provider>
  );
}

function ConnectorSelector() {
  const { setConnector } = useConnectorStore();
  const config = useConfig();

  const connector = useMemo(() => {
    if (!config.state.current) return null;
    return config.state.connections.get(config.state.current)?.connector?.type;
  }, [config.state.connections, config.state.current]);

  useEffect(() => {
    console.log('connector', connector ?? null);
    setConnector(asType<ConnectorStoreState['connector']>(connector) ?? null);
  }, [connector]);

  return null;
}

function _Providers({
  appTitle,
  nav,
  children,
  requireGeofence = false,
  requireTerms = true
}: Props) {
  const { connector } = useConnectorStore();

  const appInfo = useMemo(
    () => ({
      appName: appTitle,
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'CI',
      disclaimer: RainbowKitDisclaimer
    }),
    [appTitle]
  );

  // const {
  //   wallets: [{ groupName, wallets }]
  // } = useMemo(
  //   () =>
  //     getDefaultWallets(appInfo),
  //   [appInfo.appName]
  // );

  // const projectId = appInfo.projectId;
  // const connectors = useMemo(
  //   () =>
  //     connectorsForWallets([
  //       {
  //         groupName,
  //         wallets: [
  //           injectedWallet,
  //           metaMaskWallet,
  //           rainbowWallet,
  //           coinbaseWallet,
  //           walletConnectWallet,
  //           rabbyWallet
  //         ]
  //       },
  //       {
  //         groupName: 'Other',
  //         wallets: [
  //           argentWallet,
  //           trustWallet,
  //           braveWallet,
  //           ledgerWallet,
  //           safeWallet,
  //         ]
  //       }
  //     ], appInfo),
  //   [wallets, groupName, projectId, chains]
  // );

  // const wagmiConfig = useMemo(
  //   () =>
  //     createConfig({
  //       connectors,
  //       publicClient,
  //       webSocketPublicClient
  //     }),
  //   [connectors]
  // );

  const { wallets } = useMemo(getDefaultWallets, []);

  const transports = useMemo(() => {
    const _transports: Parameters<typeof fallback>[0] = [];
    if (connector)
      _transports.push(
        unstable_connector(
          asType<Parameters<typeof unstable_connector>[0]>(connector)
        )
      );
    if (process.env.NEXT_PUBLIC_ALCHEMY_ID) _transports.push(http());
    if (process.env.NEXT_PUBLIC_INFURA_ID) _transports.push(http());
    _transports.push(http());
    return _transports;
  }, [connector]);

  const config = useMemo(() => {
    return getDefaultConfig({
      ...appInfo,
      ssr: true,
      chains: chooseChain(CHAIN_ID),
      batch: { multicall: true },
      wallets: [
        ...wallets,
        {
          groupName: 'Other',
          wallets: [
            injectedWallet,
            rabbyWallet,
            argentWallet,
            trustWallet,
            braveWallet,
            ledgerWallet,
            safeWallet
          ]
        }
      ],
      transports: {
        [chooseChain(CHAIN_ID)[0].id]: fallback(transports)
      }
    }) as WagmiProviderProps['config'];
  }, [appInfo, connector]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          appInfo={appInfo}
          initialChain={CHAIN_ID}
        >
          <RioNetworkProvider>
            <RioTransactionStoreProvider>
              <WalletAndTermsStoreProvider
                requireGeofence={requireGeofence}
                requireTerms={requireTerms}
              >
                <ThemeProvider value={theme}>
                  <TouchProvider>
                    <ConnectorSelector />

                    <CssBaseline />
                    <Layout nav={nav}>
                      {children}
                      <Toaster />
                      <Analytics />
                      <SpeedInsights />
                    </Layout>
                  </TouchProvider>
                </ThemeProvider>
              </WalletAndTermsStoreProvider>
            </RioTransactionStoreProvider>
          </RioNetworkProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function Providers(props: Props) {
  return (
    <ProviderWrapper>
      <_Providers {...props} />
    </ProviderWrapper>
  );
}

export default Providers;
