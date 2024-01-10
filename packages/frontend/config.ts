import iconEth from './src/assets/icon-eth.svg';
import iconDiscord from './src/assets/icon-discord.svg';
import iconPaper from './src/assets/icon-paper.svg';
import iconX from './src/assets/icon-x.svg';
import iconTelegram from './src/assets/icon-telegram.svg';
import iconGithub from './src/assets/icon-github.svg';
import iconMail from './src/assets/icon-mail.svg';
import { CHAIN_ID_NUMBER } from './src/lib/typings';

export const APP_TITLE = 'Rio Network';
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
  ? (parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) as CHAIN_ID_NUMBER)
  : (5 as CHAIN_ID_NUMBER);

export const APP_NAV_ITEMS = [
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
export const APP_SECONDARY_NAV_ITEMS = [
  {
    label: 'Vote',
    url: '/',
    icon: iconPaper
  },
  {
    label: 'reETH',
    url: 'withdraw',
    icon: iconEth
  }
];

export const APP_TERTIARY_NAV_ITEMS = [
  {
    label: 'Docs',
    url: '/'
  },
  {
    label: 'News',
    url: '/'
  },
  {
    label: 'Data',
    url: '/'
  }
];

export const APP_SOCIAL_NAV_ITEMS = [
  {
    url: 'https://discord.gg/rio-network',
    icon: iconDiscord
  },
  {
    url: 'https://x.com/RioRestaking',
    icon: iconX
  },
  {
    url: 'https://github.com/rio-org',
    icon: iconGithub
  },
  {
    url: 'https://t.me/rionetworkupdates',
    icon: iconTelegram
  },
  {
    url: 'mailto:hi@rio.network',
    icon: iconMail
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
