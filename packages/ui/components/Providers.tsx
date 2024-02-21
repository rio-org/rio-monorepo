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
import { QueryClient, QueryClientProvider } from 'react-query';
import { RioNetworkProvider } from '@rionetwork/sdk-react';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, sepolia, goerli } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { useMemo } from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  type WalletList
} from '@rainbow-me/rainbowkit';
import { ThemeProvider } from '@material-tailwind/react';
import CssBaseline from '@mui/material/CssBaseline';
import {
  createConfig,
  configureChains,
  WagmiConfig,
  type Chain,
  type Connector
} from 'wagmi';
import RioTransactionStoreProvider from '../contexts/RioTransactionStore';
import { RainbowKitDisclaimer } from './Shared/RainbowKitDisclaimer';
import Layout, { type LayoutProps } from './Layout';
import { theme } from '../lib/theme';
import { CHAIN_ID } from '../config';
import WalletAndTermsStoreProvider from '../contexts/WalletAndTermsStore';
import { TouchProvider } from '../contexts/TouchProvider';

// Create the cache client
const queryClient = new QueryClient();

const chooseChain = (chainId: number) => {
  if (chainId === 1) {
    return [mainnet] as Chain[];
  } else if (chainId === 5) {
    return [goerli] as Chain[];
  } else if (chainId === 11155111) {
    return [sepolia] as Chain[];
  } else {
    throw new Error('Invalid chain id');
  }
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  chooseChain(CHAIN_ID),
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID || '' }),
    publicProvider()
  ],
  { batch: { multicall: true } }
);

interface Props extends LayoutProps {
  requireGeofence?: boolean;
  requireTerms?: boolean;
  appTitle: string;
}

export function Providers({
  appTitle,
  nav,
  children,
  requireGeofence = false,
  requireTerms = true
}: Props) {
  const appInfo = useMemo(
    () => ({
      appName: appTitle,
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'CI',
      disclaimer: RainbowKitDisclaimer
    }),
    [appTitle]
  );

  const {
    wallets: [{ groupName, wallets }]
  } = useMemo(
    () =>
      getDefaultWallets({
        appName: appInfo.appName,
        projectId: appInfo.projectId,
        chains
      }) as { wallets: WalletList },
    [appInfo.appName]
  );

  const projectId = appInfo.projectId;
  const connectors = useMemo(
    () =>
      connectorsForWallets([
        {
          groupName,
          wallets: [
            injectedWallet({ chains }),
            ...wallets,
            rabbyWallet({ chains })
          ]
        },
        {
          groupName: 'Other',
          wallets: [
            argentWallet({ projectId, chains }),
            trustWallet({ projectId, chains }),
            braveWallet({ projectId, chains }),
            ledgerWallet({ projectId, chains }),
            safeWallet({ chains })
          ]
        }
      ]) as unknown as Connector[],
    [wallets, groupName, projectId, chains]
  );

  const wagmiConfig = useMemo(
    () =>
      createConfig({
        autoConnect: true,
        connectors,
        publicClient,
        webSocketPublicClient
      }),
    [connectors]
  );

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider modalSize="compact" appInfo={appInfo} chains={chains}>
        <QueryClientProvider client={queryClient}>
          <RioNetworkProvider>
            <RioTransactionStoreProvider>
              <WalletAndTermsStoreProvider
                requireGeofence={requireGeofence}
                requireTerms={requireTerms}
              >
                <ThemeProvider value={theme}>
                  <TouchProvider>
                    <CssBaseline />
                    <Layout nav={nav}>
                      {children}
                      <Analytics />
                      <SpeedInsights />
                    </Layout>
                  </TouchProvider>
                </ThemeProvider>
              </WalletAndTermsStoreProvider>
            </RioTransactionStoreProvider>
          </RioNetworkProvider>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default Providers;
