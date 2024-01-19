import { InternalAppNavItem, LogoNavItem } from '@rio-monorepo/ui/lib/typings';

export * from '@rio-monorepo/ui/config';

export const APP_TITLE = 'Rio Network Operators';

export const APP_NAV_LOGO_ITEM: LogoNavItem = {
  label: APP_TITLE,
  url: 'https://rio.network',
  external: true
};

export const APP_NAV_ITEMS: InternalAppNavItem[] = [
  {
    label: 'Keys',
    slug: '/'
  }
];

export const WITHDRAW_NAV_ITEMS = [
  {
    label: 'Request',
    slug: ''
  },
  {
    label: 'Claim',
    slug: 'claim'
  },
  {
    label: 'History',
    slug: 'history'
  }
];
