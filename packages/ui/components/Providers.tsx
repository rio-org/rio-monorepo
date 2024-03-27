import '../styles/global.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import '@rainbow-me/rainbowkit/styles.css';

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RioNetworkProvider } from '@rionetwork/sdk-react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@material-tailwind/react';
import { mainnet, goerli, holesky } from 'wagmi/chains';
import { SkeletonTheme } from 'react-loading-skeleton';
import CssBaseline from '@mui/material/CssBaseline';
import { Analytics } from '@vercel/analytics/react';
import { http, type Chain } from 'viem';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import {
  injectedWallet,
  argentWallet,
  trustWallet,
  rabbyWallet,
  safeWallet,
  ledgerWallet,
  braveWallet
} from '@rainbow-me/rainbowkit/wallets';
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultWallets,
  darkTheme as rainbowDarkTheme
} from '@rainbow-me/rainbowkit';
import {
  injected,
  walletConnect,
  metaMask,
  coinbaseWallet,
  safe
} from 'wagmi/connectors';
import {
  createConfig,
  fallback,
  unstable_connector,
  type CreateConnectorFn,
  type WagmiProviderProps
} from 'wagmi';
import { RainbowKitDisclaimer } from './Shared/RainbowKitDisclaimer';
import Layout, { type LayoutProps } from './Layout';
import { Toaster } from './shadcn/toaster';
import RioTransactionStoreProvider from '../contexts/RioTransactionStore';
import WalletAndTermsStoreProvider from '../contexts/WalletAndTermsStore';
import { AppContextProvider } from '../contexts/AppContext';
import { TouchProvider } from '../contexts/TouchProvider';
import {
  getAlchemyRpcUrl,
  getAnkrRpcUrl,
  getInfuraRpcUrl
} from '../lib/utilities';
import { AppEnv, Theme } from '../lib/typings';
import { theme } from '../lib/theme';
import { APP_ENV, CHAIN_ID } from '../config';

const WagmiProvider = dynamic(
  import('wagmi').then((mod) => mod.WagmiProvider),
  { ssr: false }
);

// Create the cache client
const queryClient = new QueryClient();

// const chooseChain = (): [Chain, ...Chain[]] => {
//   if (APP_ENV === AppEnv.PRODUCTION && CHAIN_ID === mainnet.id) {
//     return [mainnet, holesky, goerli];
//   } else {
//     return [holesky, goerli]
//   }
// };

const getTransports = (chainId: number) => {
  const _transports: Parameters<typeof fallback>[0] = [];
  // wallet connectors
  // note: it sucks that these _all_ have to be added (especially in
  //       some random order), but if we try to add them all conditionally
  //       the wallet connector resets and the user gets disconnected on
  //       page reload and/or navigation
  _transports.push(unstable_connector(injected));
  _transports.push(unstable_connector(metaMask));
  _transports.push(unstable_connector(walletConnect));
  _transports.push(unstable_connector(coinbaseWallet));
  _transports.push(unstable_connector(safe));
  // dedicated rpcs
  _transports.push(http(getInfuraRpcUrl(chainId)));
  _transports.push(http(getAlchemyRpcUrl(chainId)));
  _transports.push(http(getAnkrRpcUrl(chainId)));
  // public rpc
  if (chainId !== goerli.id) {
    _transports.push(http());
  }
  return _transports.filter(Boolean);
};

interface Props extends LayoutProps {
  requireGeofence?: boolean;
  requireTerms?: boolean;
  appTitle: string;
  chains: [Chain, ...Chain[]];
}

const _appInfo = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'CI',
  disclaimer: RainbowKitDisclaimer
};

const { wallets } = getDefaultWallets();
// const chains = chooseChain();

export function Providers({
  appTitle,
  nav,
  children,
  requireGeofence = false,
  requireTerms = true,
  chains
}: Props) {
  const appInfo = useMemo(
    () => ({ appName: appTitle, ..._appInfo }),
    [appTitle]
  );

  const transports = useMemo(() => {
    return Object.fromEntries(
      chains.map((chain) => [chain.id, fallback(getTransports(chain.id))])
    );
  }, []);

  const connectors = useMemo(() => {
    return connectorsForWallets(
      [
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
      appInfo
    ) as CreateConnectorFn[];
  }, [appInfo]);

  const config = useMemo(() => {
    return createConfig({
      ...appInfo,
      ssr: true,
      chains,
      batch: { multicall: true },
      connectors,
      transports
    }) as WagmiProviderProps['config'];
  }, [appInfo, wallets, transports]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <_RainbowKitProvider
            modalSize="compact"
            appInfo={appInfo}
            initialChain={chains[0]}
          >
            <RioNetworkProvider subgraphApiKey={process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY}>
              <RioTransactionStoreProvider>
                <WalletAndTermsStoreProvider
                  requireGeofence={requireGeofence}
                  requireTerms={requireTerms}
                >
                  <ThemeProvider value={theme}>
                    <TouchProvider>
                      <AppContextProvider>
                        <CssBaseline />
                        <SkeletonTheme
                          baseColor="hsl(var(--foreground) / 6%)"
                          highlightColor="hsl(var(--foreground) / 6%)"
                        >
                          <Layout nav={nav}>
                            {children}
                            <Toaster />
                            <Analytics />
                            <SpeedInsights />
                          </Layout>
                        </SkeletonTheme>
                      </AppContextProvider>
                    </TouchProvider>
                  </ThemeProvider>
                </WalletAndTermsStoreProvider>
              </RioTransactionStoreProvider>
            </RioNetworkProvider>
          </_RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </NextThemesProvider>
  );
}

export default Providers;

function _RainbowKitProvider(props: Parameters<typeof RainbowKitProvider>[0]) {
  const { theme, systemTheme } = useTheme();
  const isDark =
    theme === Theme.DARK || (theme === 'system' && systemTheme === 'dark');
  return (
    <RainbowKitProvider
      {...props}
      theme={isDark ? rainbowDarkTheme() : undefined}
    />
  );
}
