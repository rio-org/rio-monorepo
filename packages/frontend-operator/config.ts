import { InternalAppNavItem, LogoNavItem } from '@rio-monorepo/ui/lib/typings';

export * from '@rio-monorepo/ui/config';

export const APP_TITLE = 'Rio Network Operators';

export const REQUIRE_ACCEPTANCE_OF_TERMS = true;
export const REQUIRE_GEOFENCE = false;

export const APP_NAV_LOGO_ITEM: LogoNavItem = {
  label: APP_TITLE,
  url: 'https://rio.network',
  external: true
};

export const APP_NAV_ITEMS: InternalAppNavItem[] = [
  {
    label: 'Keys',
    slug: '/'
  },
  {
    label: 'Earnings',
    slug: 'earnings'
  }
];

export const OPERATOR_KEYS_NAV_ITEMS = [
  {
    label: 'Submitter',
    slug: ''
  }
];
