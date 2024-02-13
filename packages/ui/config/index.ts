import iconEth from '../assets/icon-eth.svg';
import iconDiscord from '../assets/icon-discord.svg';
import iconPaper from '../assets/icon-paper.svg';
import iconX from '../assets/icon-x.svg';
import iconTelegram from '../assets/icon-telegram.svg';
import iconGithub from '../assets/icon-github.svg';
import iconMail from '../assets/icon-mail.svg';
import { getAddress } from 'viem';
import {
  AppEnv,
  type CHAIN_ID_NUMBER,
  type NavItem,
  type SocialNavItem
} from '../lib/typings';

////////////////
// Environment
////////////////

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
  ? (parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) as CHAIN_ID_NUMBER)
  : (5 as CHAIN_ID_NUMBER);

export const APP_ENV = (process.env.NEXT_PUBLIC_APP_ENV ||
  AppEnv.DEVELOPMENT) as AppEnv;

export const DATADOG_APPLICATION_ID =
  process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID ?? '';
export const DATADOG_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN ?? '';

// We internally use this instead of the zero address when referencing native ETH
export const NATIVE_ETH_ADDRESS = getAddress(
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
);

//////////////////////
// Default Nav Items
//////////////////////

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
    url: 'https://docs.rio.network/rio-network-docs',
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
