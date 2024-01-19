import { InternalAppNavItem, LogoNavItem } from '@rio-monorepo/ui/lib/typings';

export * from '@rio-monorepo/ui/config';

export const APP_TITLE = 'Rio Network';

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
    label: 'Withdraw',
    slug: 'withdraw'
  },
  {
    label: 'Rewards',
    slug: 'rewards'
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
