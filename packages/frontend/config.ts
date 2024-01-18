import iconEth from './src/assets/icon-eth.svg';
import iconDiscord from './src/assets/icon-discord.svg';
import iconPaper from './src/assets/icon-paper.svg';
import iconX from './src/assets/icon-x.svg';
import iconTelegram from './src/assets/icon-telegram.svg';
import iconGithub from './src/assets/icon-github.svg';
import iconMail from './src/assets/icon-mail.svg';
import { CHAIN_ID_NUMBER } from './src/lib/typings';
import { getAddress } from 'viem';

export const APP_TITLE = 'Rio Network';
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
  ? (parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) as CHAIN_ID_NUMBER)
  : (5 as CHAIN_ID_NUMBER);

// Temporary so that the UI correctly switches between states for
// single asset (only ETH) or multi asset (ETH + LSTs)
export const ALLOW_ALL_LSTS = false;
export const ASSET_SYMBOLS_ALLOWED: { [symbol: string]: boolean | undefined } =
  {
    ETH: true,
    WETH: true,
    reETH: true
  };

// We internally use this instead of the zero address when referencing native ETH
export const NATIVE_ETH_ADDRESS = getAddress(
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
);

export const APP_NAV_LOGO_ITEM = {
  label: APP_TITLE,
  url: 'https://rio.network',
  external: true
};

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
    url: undefined,
    icon: iconPaper,
    external: false
  },
  {
    label: 'reETH',
    url: 'https://www.rio.network/re-eth',
    icon: iconEth,
    external: true
  }
];

export const APP_TERTIARY_NAV_ITEMS = [
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
] as const;

export const APP_SOCIAL_NAV_ITEMS = [
  {
    url: 'https://discord.gg/rio-network',
    icon: iconDiscord,
    external: true
  },
  {
    url: 'https://x.com/RioRestaking',
    icon: iconX,
    external: true
  },
  {
    url: 'https://github.com/rio-org',
    icon: iconGithub,
    external: true
  },
  {
    url: 'https://t.me/rionetworkupdates',
    icon: iconTelegram,
    external: true
  },
  {
    url: 'mailto:hi@rio.network',
    icon: iconMail,
    external: true
  }
] as const;

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
