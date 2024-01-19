import iconEth from '@rio-monorepo/ui/assets/icon-eth.svg';
import iconDiscord from '@rio-monorepo/ui/assets/icon-discord.svg';
import iconPaper from '@rio-monorepo/ui/assets/icon-paper.svg';
import iconX from '@rio-monorepo/ui/assets/icon-x.svg';
import iconTelegram from '@rio-monorepo/ui/assets/icon-telegram.svg';
import iconGithub from '@rio-monorepo/ui/assets/icon-github.svg';
import iconMail from '@rio-monorepo/ui/assets/icon-mail.svg';
import {
  InternalAppNavItem,
  NavItem,
  LogoNavItem,
  SocialNavItem
} from '@rio-monorepo/ui/lib/typings';

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

export const APP_SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    label: 'Vote',
    url: undefined,
    icon: iconPaper as string,
    external: false
  },
  {
    label: 'reETH',
    url: 'https://www.rio.network/re-eth',
    icon: iconEth as string,
    external: true
  }
];

export const APP_TERTIARY_NAV_ITEMS: NavItem[] = [
  {
    label: 'Docs',
    url: 'https://rio.gitbook.io/rio-network-updates/updates/introducing-rio-network',
    external: true
  },
  {
    label: 'News',
    url: undefined,
    external: true
  },
  {
    label: 'Data',
    url: undefined,
    external: true
  }
];

export const APP_SOCIAL_NAV_ITEMS: SocialNavItem[] = [
  {
    label: 'Discord',
    url: 'https://discord.gg/rio-network',
    icon: iconDiscord as string,
    external: true
  },
  {
    label: 'X / Twitter',
    url: 'https://x.com/RioRestaking',
    icon: iconX as string,
    external: true
  },
  {
    label: 'Github',
    url: 'https://github.com/rio-org',
    icon: iconGithub as string,
    external: true
  },
  {
    label: 'Telegram',
    url: 'https://t.me/rionetworkupdates',
    icon: iconTelegram as string,
    external: true
  },
  {
    label: 'Email',
    url: 'mailto:hi@rio.network',
    icon: iconMail as string,
    external: true
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
