import { Chain, goerli, holesky, mainnet } from 'viem/chains';
import type { AppProps } from 'next/app';
import { useMemo } from 'react';
import Head from 'next/head';
import Providers from '@rio-monorepo/ui/components/Providers';
import { AppEnv } from '@rio-monorepo/ui/lib/typings';
import {
  APP_TITLE,
  APP_NAV_ITEMS,
  APP_SECONDARY_NAV_ITEMS,
  APP_TERTIARY_NAV_ITEMS,
  APP_NAV_LOGO_ITEM,
  APP_SOCIAL_NAV_ITEMS,
  REQUIRE_GEOFENCE,
  REQUIRE_ACCEPTANCE_OF_TERMS,
  APP_ENV,
  CHAIN_ID
} from '../../config';

export default function OperatorApp({ Component, pageProps }: AppProps) {

  const chains: [Chain, ...Chain[]] = useMemo(() => {
    if (APP_ENV === AppEnv.PRODUCTION && CHAIN_ID === mainnet.id) {
      return [mainnet, holesky, goerli];
    } else {
      return [holesky, goerli]
    }
  } ,[]);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <title>{APP_TITLE}</title>
      </Head>
      <Providers
        appTitle={APP_TITLE}
        requireGeofence={REQUIRE_GEOFENCE}
        requireTerms={REQUIRE_ACCEPTANCE_OF_TERMS}
        chains={chains}
        nav={{
          logoItem: APP_NAV_LOGO_ITEM,
          items: APP_NAV_ITEMS,
          secondaryItems: APP_SECONDARY_NAV_ITEMS,
          tertiaryItems: APP_TERTIARY_NAV_ITEMS,
          socialItems: APP_SOCIAL_NAV_ITEMS
        }}
      >
        <Component {...pageProps} />
      </Providers>
    </>
  );
}
