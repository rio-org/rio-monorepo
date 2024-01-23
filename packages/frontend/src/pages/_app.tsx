import '@rio-monorepo/ui/styles/global.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RioNetworkProvider } from '@rionetwork/sdk-react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets
} from '@rainbow-me/rainbowkit';
import { argentWallet, trustWallet } from '@rainbow-me/rainbowkit/wallets';
import {
  createConfig,
  configureChains,
  WagmiConfig,
  mainnet,
  sepolia,
  Chain
} from 'wagmi';
import { goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { ThemeProvider } from '@material-tailwind/react';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '@rio-monorepo/ui/components/Layout';
import { theme } from '@rio-monorepo/ui/lib/theme';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  APP_TITLE,
  APP_NAV_ITEMS,
  APP_SECONDARY_NAV_ITEMS,
  APP_TERTIARY_NAV_ITEMS,
  APP_NAV_LOGO_ITEM,
  APP_SOCIAL_NAV_ITEMS,
  CHAIN_ID
} from '../../config';

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

const appInfo = {
  appName: APP_TITLE,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'CI'
};
const projectId = appInfo.projectId;

const { wallets } = getDefaultWallets({
  appName: appInfo.appName,
  projectId: appInfo.projectId,
  chains
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains })
    ]
  }
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider appInfo={appInfo} chains={chains}>
        <QueryClientProvider client={queryClient}>
          <RioNetworkProvider>
            <ThemeProvider value={theme}>
              <CssBaseline />
              <Layout
                appTitle={APP_TITLE}
                nav={{
                  logoItem: APP_NAV_LOGO_ITEM,
                  items: APP_NAV_ITEMS,
                  secondaryItems: APP_SECONDARY_NAV_ITEMS,
                  tertiaryItems: APP_TERTIARY_NAV_ITEMS,
                  socialItems: APP_SOCIAL_NAV_ITEMS
                }}
              >
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </RioNetworkProvider>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
