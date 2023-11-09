import '../styles/global.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
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
  sepolia
} from 'wagmi';
import { goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ThemeProvider } from '@material-tailwind/react';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '../components/Layout';
import { APP_TITLE } from '../../config';
import { theme } from '../lib/theme';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, sepolia],
  [publicProvider()]
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
        <ThemeProvider value={theme}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
