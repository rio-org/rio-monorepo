import type { AppProps } from 'next/app';
import Providers from '@rio-monorepo/ui/components/Providers';
import {
  APP_TITLE,
  APP_NAV_ITEMS,
  APP_SECONDARY_NAV_ITEMS,
  APP_TERTIARY_NAV_ITEMS,
  APP_NAV_LOGO_ITEM,
  APP_SOCIAL_NAV_ITEMS
} from '../../config';

export default function RestakingApp({ Component, pageProps }: AppProps) {
  return (
    <Providers
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
  );
}
