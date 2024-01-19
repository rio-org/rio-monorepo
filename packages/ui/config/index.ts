import iconEth from '../assets/icon-eth.svg';
import iconDiscord from '../assets/icon-discord.svg';
import iconPaper from '../assets/icon-paper.svg';
import iconX from '../assets/icon-x.svg';
import iconTelegram from '../assets/icon-telegram.svg';
import iconGithub from '../assets/icon-github.svg';
import iconMail from '../assets/icon-mail.svg';
import { CHAIN_ID_NUMBER } from '../lib/typings';
import { getAddress } from 'viem';
import { NavItem, SocialNavItem } from '../lib/typings';

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