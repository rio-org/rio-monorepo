import { InternalAppNavItem, LogoNavItem } from '@rio-monorepo/ui/lib/typings';

export * from '@rio-monorepo/ui/config';

export const APP_TITLE = 'Rio Network';

export const REQUIRE_ACCEPTANCE_OF_TERMS = true;
export const REQUIRE_GEOFENCE = true;

export const APP_NAV_LOGO_ITEM: LogoNavItem = {
  label: APP_TITLE,
  url: 'https://rio.network',
  external: true
};

export const APP_NAV_ITEMS: InternalAppNavItem[] = [
  {
    label: 'Restake',
    slug: '/'
  },
  {
    label: 'History',
    slug: 'history'
  }
];
