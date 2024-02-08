import Head from 'next/head';
import type { AppProps } from 'next/app';
import Providers from '@rio-monorepo/ui/components/Providers';
import {
  APP_TITLE,
  APP_NAV_ITEMS,
  APP_SECONDARY_NAV_ITEMS,
  APP_TERTIARY_NAV_ITEMS,
  APP_NAV_LOGO_ITEM,
  APP_SOCIAL_NAV_ITEMS,
  REQUIRE_GEOFENCE,
  REQUIRE_ACCEPTANCE_OF_TERMS
} from '../../config';

export default function OperatorApp({ Component, pageProps }: AppProps) {
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
