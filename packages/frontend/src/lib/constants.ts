import { AddressType, Asset, AssetAddress } from './typings';
import ethLogo from '../assets/eth-logo.png';
import stETHLogo from '../assets/stETH-logo.png';
import rETHLogo from '../assets/rETH-logo.png';
import wstETHLogo from '../assets/wstETH-logo.png';
import cbETHLogo from '../assets/cbETH-logo.png';
import allEthLogo from '../assets/all-eth-logo.png';

export const NULL_ADDRESS =
  '0x0000000000000000000000000000000000000000' as AddressType;
export const HASH_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
export const testBuilderDaoCollectionAddress =
  '0xf67eb5caee7125aebd0c0490d6d8c059af63b149' as AddressType;
export const UINT_64_MAX = BigInt('18446744073709551615');
export const UINT_32_MAX = BigInt('4294967295');

export const ASSET_ADDRESS: AssetAddress = {
  ETH: '0x00000',
  stETH: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  rETH: '0xae78736cd615f374d3085123a210448e74fc6393',
  cbETH: '0xbe9895146f7af43049ca1c1ae358b0541ea49704',
  wstETH: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
  reETH: '0x00000',
  '＊ETH': null
};

export const ASSETS: Asset = {
  '＊ETH': {
    name: 'stETH, cbETH, rETH, wstETH, ETH',
    symbol: '＊ETH',
    logo: allEthLogo,
    address: null
  },
  ETH: {
    name: 'Ether',
    symbol: 'ETH',
    logo: ethLogo,
    address: null
  },
  stETH: {
    name: 'Lido Staked Ether',
    symbol: 'stETH',
    logo: stETHLogo,
    address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'
  },
  rETH: {
    name: 'Rocketpool ETH',
    symbol: 'rETH',
    logo: rETHLogo,
    address: '0xae78736cd615f374d3085123a210448e74fc6393'
  },
  cbETH: {
    name: 'Coinbase Wrapped Staked ETH',
    symbol: 'cbETH',
    logo: cbETHLogo,
    address: '0xbe9895146f7af43049ca1c1ae358b0541ea49704'
  },
  wstETH: {
    name: 'Wrapped Staked ETH',
    symbol: 'wstETH',
    logo: wstETHLogo,
    address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0'
  },
  reETH: {
    name: 'reETH',
    symbol: 'reETH',
    logo: rETHLogo,
    address: '0x00000' // todo
  }
};

// prettier-ignore
// Demo Subgraph URLs
export const PUBLIC_SUBGRAPH_URL = {
  1: 'https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-ethereum-mainnet/stable/gn',
  5: 'https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-goerli-testnet/stable/gn',
  11155111: 'https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-goerli-testnet/stable/gn',
  10: 'https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-optimism-mainnet/stable/gn',
  420: 'https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-optimism-testnet/stable/gn',
  8453: 'https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-base-mainnet/stable/gn',
  84531: 'https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-base-testnet/stable/gn',
  31337: 'https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-zora-mainnet/stable/gn',
  7777777: 'https://api.goldsky.com/api/public/project_clkk1ucdyf6ak38svcatie9tf/subgraphs/nouns-builder-zora-testnet/stable/gn',
  999: 'https://api.thegraph.com/subgraphs/name/neokry/nouns-builder-mainnet'
};

export const TX_BUTTON_VARIANTS = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: 20
  }
};

export const DESKTOP_MQ = '(min-width: 960px)';
