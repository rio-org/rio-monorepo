import iconEth from './src/assets/icon-eth.svg';
import iconPaper from './src/assets/icon-paper.svg';
import iconTwitter from './src/assets/icon-twitter.svg';
import iconTelegram from './src/assets/icon-telegram.svg';
import iconGithub from './src/assets/icon-github.svg';
import iconMail from './src/assets/icon-mail.svg';
import { CHAIN_ID_NUMBER } from './src/lib/typings';

export const APP_TITLE = 'Rio Network';
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
  ? (parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) as CHAIN_ID_NUMBER)
  : (0 as CHAIN_ID_NUMBER);

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
    url: '/',
    icon: iconTwitter
  },
  {
    url: '/',
    icon: iconGithub
  },
  {
    url: '/',
    icon: iconTelegram
  },
  {
    url: '/',
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
