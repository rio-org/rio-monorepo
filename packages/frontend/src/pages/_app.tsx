import type { AppProps } from 'next/app';
import Providers from '@rio-monorepo/ui/components/Providers';
import { useInitDataDog } from '@rio-monorepo/ui/hooks/useInitDataDog';
import { MetaHeaders } from '@rio-monorepo/ui/components/Shared/MetaHeaders';
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

export default function RestakingApp({ Component, pageProps }: AppProps) {
  useInitDataDog('rio-network-app');
  return (
    <>
      <MetaHeaders
        title="Rio Network: The Liquid Restaking Network"
        description="Scaling Restaking through Access, Liquidity, and Risk Adjusted Yield"
        image="/og.png"
      />
      <Providers
        requireGeofence={REQUIRE_GEOFENCE}
        requireTerms={REQUIRE_ACCEPTANCE_OF_TERMS}
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
      </Providers>
    </>
  );
}
