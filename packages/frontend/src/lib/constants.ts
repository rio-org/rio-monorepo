import { AddressType, Asset, AssetAddress } from './typings';
import ethLogo from '../assets/eth-logo.png';
import stETHLogo from '../assets/stETH-logo.png';
import rETHLogo from '../assets/rETH-logo.png';
import wstETHLogo from '../assets/wstETH-logo.png';
import cbETHLogo from '../assets/cbETH-logo.png';
import allEthLogo from '../assets/all-eth-logo.png';
import { zeroAddress } from 'viem';
import { CHAIN_ID } from '../../config';

export const NULL_ADDRESS =
  '0x0000000000000000000000000000000000000000' as AddressType;
export const HASH_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
export const testBuilderDaoCollectionAddress =
  '0xf67eb5caee7125aebd0c0490d6d8c059af63b149' as AddressType;
export const UINT_64_MAX = BigInt('18446744073709551615');
export const UINT_32_MAX = BigInt('4294967295');
export const DISPLAYED_DECIMALS = 3;

const REETH_GOERLI_ADDRESS = "0x7e32cd577893fdf6a7ee822f1213563a052e1fe2"
const REETH_MAINNET_ADDRESS = "0x00000"
export const REETH_ADDRESS = CHAIN_ID === 5 ? REETH_GOERLI_ADDRESS : REETH_MAINNET_ADDRESS

const GOERLI_ASSET_ADDRESS: AssetAddress = {
  ETH: '0x0000000000000000000000000000000000000000',
  WETH: '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1',
  stETH: '0x1643e812ae58766192cf7d2cf9567df2c37e9b7f',
  rETH: '0xae78736cd615f374d3085123a210448e74fc6393',
  cbETH: '0xbe9895146f7af43049ca1c1ae358b0541ea49704',
  wstETH: '0x6320cd32aa674d2898a68ec82e869385fc5f7e2f',
  reETH: REETH_GOERLI_ADDRESS,
  '＊ETH': null
};

// TODO:
const MAINNET_ASSET_ADDRESS: AssetAddress = {
  ETH: '0x0000000000000000000000000000000000000000',
  WETH: '0x00000',
  stETH: '0x00000',
  rETH: '0x00000',
  cbETH: '0x00000',
  wstETH: '0x00000',
  reETH: '0x00000',
  '＊ETH': null
};

export const ASSET_ADDRESS: AssetAddress =
  CHAIN_ID === 5 ? GOERLI_ASSET_ADDRESS : MAINNET_ASSET_ADDRESS;

export const ASSET_LOGOS = {
  '＊ETH': allEthLogo,
  ETH: ethLogo,
  WETH: ethLogo,
  stETH: stETHLogo,
  rETH: rETHLogo,
  cbETH: cbETHLogo,
  wstETH: wstETHLogo,
  reETH: rETHLogo
};

export const ASSETS: Asset = {
  '＊ETH': {
    name: 'stETH, cbETH, rETH, wstETH, ETH',
    symbol: '＊ETH',
    logo: allEthLogo,
    address: zeroAddress,
    decimals: 18
  },
  ETH: {
    name: 'Ether',
    symbol: 'ETH',
    logo: ethLogo,
    address: zeroAddress,
    decimals: 18
  },
  WETH: {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    logo: ethLogo,
    address: zeroAddress,
    decimals: 18
  },
  stETH: {
    name: 'Lido Staked Ether',
    symbol: 'stETH',
    logo: stETHLogo,
    address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
    decimals: 18
  },
  rETH: {
    name: 'Rocketpool ETH',
    symbol: 'rETH',
    logo: rETHLogo,
    address: '0xae78736cd615f374d3085123a210448e74fc6393',
    decimals: 18
  },
  cbETH: {
    name: 'Coinbase Wrapped Staked ETH',
    symbol: 'cbETH',
    logo: cbETHLogo,
    address: '0xbe9895146f7af43049ca1c1ae358b0541ea49704',
    decimals: 18
  },
  wstETH: {
    name: 'Wrapped Staked ETH',
    symbol: 'wstETH',
    logo: wstETHLogo,
    address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
    decimals: 18
  },
  reETH: {
    name: 'reETH',
    symbol: 'reETH',
    logo: rETHLogo,
    address: '0x00000', // todo,
    decimals: 18
  }
};

// prettier-ignore
// Demo Subgraph URLs
export const PUBLIC_SUBGRAPH_URL = {
  1: 'https://api.thegraph.com/subgraphs/name/rio-org/rio-network-mainnet',
  5: 'https://api.thegraph.com/subgraphs/name/rio-org/rio-network-goerli',
  11155111: '',
  10: '',
  420: '',
  8453: '',
  84531: '',
  31337: '',
  7777777: '',
  999: ''
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
