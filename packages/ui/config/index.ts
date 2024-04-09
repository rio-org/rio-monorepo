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

export const APP_ENV = (process.env.NEXT_PUBLIC_APP_ENV ||
  AppEnv.DEVELOPMENT) as AppEnv;

export const API_URL = `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/v1`;

export const CHAIN_ID = 17000 as CHAIN_ID_NUMBER;

export const DATADOG_APPLICATION_ID =
  process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID ?? '';
export const DATADOG_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN ?? '';

export const SUBGRAPH_API_KEY =
  process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY ?? 'apikey';

// We internally use this instead of the zero address when referencing native ETH
export const NATIVE_ETH_ADDRESS = getAddress(
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
);

//////////////////////
// Default Nav Items
//////////////////////

export const RESTAKING_TOKEN_NAV_ITEMS: { [symbol: string]: NavItem } = {
  reETH: {
    label: 'reETH',
    url: 'https://www.rio.network/re-eth',
    icon: iconEth as string,
    external: true
  }
};

export const DOCUMENTATION_NAV_ITEM: NavItem = {
  label: 'Docs',
  url: 'https://docs.rio.network',
  external: true
};

export const APP_SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    label: 'Vote',
    url: undefined,
    icon: iconPaper as string,
    external: false,
    disabled: true
  }
];

export const APP_TERTIARY_NAV_ITEMS: NavItem[] = [
  {
    ...DOCUMENTATION_NAV_ITEM,
    hideOn: ['desktop']
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

export const RIO_CONTRACT_DESCRIPTIONS = {
  RioLRT:
    'The Rio Liquid Restaking Token (LRT) issued by the Rio Protocol through the RioDAO ("DAO").',
  RioLRTIssuer:
    'Proposals made through the RioDAO ("DAO") are responsible for deploying a new Rio LRT. The DAO will interact with the LRT Issuer factory contract when deploying new LRTs.',
  RioLRTAssetRegistry:
    'The Asset Registry is responsible for storing the underlying assets available in the Rio LRT. This registry will also catalog the underlying EigenLayer strategy for each token.',
  RioLRTAVSRegistry:
    'The AVS Registry contract stores the AVSs that Operators can register for and subsequently opt into their slashing contracts.',
  RioLRTCoordinator:
    'Once a Rio LRT has been issued, the LRT Coordinator is responsible for processing deposits, withdrawals, and downstream deposits into EigenLayer',
  RioLRTDepositPool:
    'The Deposit functionality in the Coordinator contract works by pulling tokens from the sender/user and sending them to the Rio Deposit Pool.',
  RioLRTOperatorRegistry:
    'The Operator Registry contract manages the creation, activation, registration, configuration, and fund allocation/deallocation for the Operator ecosystem.',
  RioLRTRewardDistributor:
    'The Reward Distributor contract has the ability to receive ETH via the Ethereum Execution Layer or EigenPod rewards and then distribute those rewards.',
  RioLRTWithdrawalQueue:
    'To efficiently handle user withdrawals, the Rio Protocol will pull the Rio restaking tokens from the user and place them into a Withdrawal Queue.'
};
