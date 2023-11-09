import { AddressType } from './typings';

export const NULL_ADDRESS =
  '0x0000000000000000000000000000000000000000' as AddressType;
export const HASH_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
export const testBuilderDaoCollectionAddress =
  '0xf67eb5caee7125aebd0c0490d6d8c059af63b149' as AddressType;
export const UINT_64_MAX = BigInt('18446744073709551615');
export const UINT_32_MAX = BigInt('4294967295');

export const appNavItems = [
  {
    label: 'Restake',
    slug: '/'
  },
  {
    label: 'Withdraw',
    slug: '/withdraw'
  },
  {
    label: 'Rewards',
    slug: '/rewards'
  }
]

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
