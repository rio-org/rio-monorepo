import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Address, formatUnits, getAddress, zeroAddress } from 'viem';
import { ASSETS, ASSET_LOGOS } from './constants';
import {
  AssetDetails,
  AssetSubgraphResponse,
  BaseAssetDetails,
  BaseAssetSubgraphResponse,
  BaseLRTSubgraphResponse,
  CHAIN_ID_NUMBER,
  LRTDetails,
  LRTSubgraphResponse,
  TokenSymbol,
  UnderlyingAssetDetails,
  UnderlyingAssetSubgraphResponse,
  ValidatorKeyItem
} from './typings';
import dayjs from 'dayjs';
import bigDecimal from 'js-big-decimal';
import { CHAIN_ID, NATIVE_ETH_ADDRESS } from '../config';
import { SubgraphClient } from '@rionetwork/sdk-react';

export const getChainName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'mainnet';
    case 5:
      return 'goerli';
    case 11155111:
      return 'sepolia';
    case 10:
      return 'optimism';
    case 420:
      return 'optimism-goerli';
    case 8453:
      return 'base';
    case 84531:
      return 'base-goerli';
    case 7777777:
      return 'zora';
    case 999:
      return 'zora-goerli';
    case 31337:
      return 'foundry';
    default:
      return 'unknown';
  }
};

export const getAlchemyChainLabel = (chainId: CHAIN_ID_NUMBER) => {
  switch (chainId) {
    case 1:
      return 'eth-mainnet';
    case 5:
      return 'eth-goerli';
    case 10:
      return 'opt-mainnet';
    case 420:
      return 'opt-goerli';
    case 8453:
      return 'base-mainnet';
    case 84531:
      return 'base-goerli';
    case 31337:
      return '';
    case 7777777:
      return 'zora-mainnet';
    case 999:
      return 'zora-goerli';
    default:
      return 'unknown';
  }
};

export const linkToAddressOnBlockExplorer = (
  address: Address,
  chainId: number
) => {
  const chainName = getChainName(chainId);
  const subdomain =
    chainName === 'goerli' || chainName === 'sepolia' ? `${chainName}.` : '';
  if (chainName === 'zora' || chainName === 'zora-goerli') {
    const subdomain = chainName === 'zora-goerli' ? 'testnet.' : '';
    return `https://${subdomain}explorer.zora.energy/address/${address}`;
  }
  return `https://${subdomain}etherscan.io/address/${address}`;
};

export const linkToTxOnBlockExplorer = (address: Address, chainId: number) => {
  const chainName = getChainName(chainId);
  const subdomain =
    chainName === 'goerli' || chainName === 'sepolia' ? `${chainName}.` : '';
  if (chainName === 'zora' || chainName === 'zora-goerli') {
    const subdomain = chainName === 'zora-goerli' ? 'testnet.' : '';
    return `https://${subdomain}explorer.zora.energy/tx/${address}`;
  }
  return `https://${subdomain}etherscan.io/tx/${address}`;
};

export const buildAssetList = (activeTokenSymbol: TokenSymbol) => {
  let assets = [ASSETS[activeTokenSymbol]];
  if (activeTokenSymbol === '＊ETH') {
    assets = Object.values(ASSETS).filter((asset) => {
      if (asset.symbol === 'reETH') return null;
      return asset.symbol !== activeTokenSymbol;
    });
  }

  return assets;
};

export const trunc = (address: string, amount: number = 4) =>
  `${address?.slice(0, amount)}...${address?.slice(
    address.length - amount,
    address.length
  )}`;

export const truncDec = (num: number, digits: number = 3) => {
  const decimalPlaces = 10 ** digits;
  return Math.trunc(num * decimalPlaces) / decimalPlaces;
};

export const parseBigIntFieldAmount = (
  amount: bigint | null,
  tokenDecimals: number
) => {
  if (amount === null) return '';
  const isSafe = (+formatUnits(amount, tokenDecimals)).toString().includes('e')
    ? false
    : true;
  if (isSafe) {
    return truncDec(+formatUnits(amount, tokenDecimals), tokenDecimals);
  } else {
    return formatUnits(amount, tokenDecimals);
  }
};

export const dateFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const str = dayjs(date).format('MMMM D, YYYY');
  return str;
};

export const parseBaseSubgraphAsset = (
  asset: BaseAssetSubgraphResponse | BaseLRTSubgraphResponse
) => {
  return <BaseAssetDetails>{
    name: asset.name,
    symbol: asset.symbol,
    address:
      !asset.address || asset.address === zeroAddress
        ? NATIVE_ETH_ADDRESS
        : asset.address,
    logo: ASSET_LOGOS[asset.symbol],
    decimals: (asset as BaseAssetSubgraphResponse).decimals ?? 18
  };
};

export const parseSubgraphAsset = (asset: AssetSubgraphResponse) => {
  return <AssetDetails>{
    ...parseBaseSubgraphAsset(asset),
    latestUSDPrice: asset.latestUSDPrice,
    latestUSDPriceTimestamp: asset.latestUSDPriceTimestamp
  };
};

export const parseUnderlyingAsset = (
  asset: UnderlyingAssetSubgraphResponse
) => {
  asset;
  return <UnderlyingAssetDetails>{
    id: asset.id,
    balance: Number(asset.balance),
    strategy: asset.strategy,
    asset: parseSubgraphAsset(asset.asset)
  };
};

export const parseSubgraphLRT = (lrt: LRTSubgraphResponse) => {
  return <LRTDetails>{
    ...parseBaseSubgraphAsset(lrt),
    decimals: /USD/i.test(lrt.symbol) ? 6 : 18,
    totalSupply: Number(lrt.totalSupply),
    percentAPY: Number(lrt.percentAPY),
    totalValueUSD: Number(lrt.totalValueUSD),
    totalValueETH: Number(lrt.totalValueETH),
    exchangeRateUSD: Number(lrt.exchangeRateUSD),
    exchangeRateETH: Number(lrt.exchangeRateETH),
    underlyingAssets: parseSubgraphUnderlyingAssetList(lrt.underlyingAssets)
  };
};

export const parseBaseSubgraphAssetList = (
  data: Parameters<typeof parseBaseSubgraphAsset>[0][]
) => {
  return JSON.parse(
    JSON.stringify(data.map(parseBaseSubgraphAsset))
  ) as ReturnType<typeof parseBaseSubgraphAsset>[];
};

export const parseSubgraphAssetList = (
  data: Parameters<typeof parseSubgraphAsset>[0][]
) => {
  return JSON.parse(JSON.stringify(data.map(parseSubgraphAsset))) as ReturnType<
    typeof parseSubgraphAsset
  >[];
};

export const parseSubgraphUnderlyingAssetList = (
  data: Parameters<typeof parseUnderlyingAsset>[0][]
) => {
  return JSON.parse(
    JSON.stringify(data.map(parseUnderlyingAsset))
  ) as ReturnType<typeof parseUnderlyingAsset>[];
};

export const parseSubgraphLRTList = (
  data: Parameters<typeof parseSubgraphLRT>[0][]
) => {
  return JSON.parse(JSON.stringify(data.map(parseSubgraphLRT))) as ReturnType<
    typeof parseSubgraphLRT
  >[];
};

export const displayEthAmount = (amount: string) => {
  const decimalPlaces = CHAIN_ID === 1 ? 2 : 3;
  return parseFloat(
    parseFloat(
      bigDecimal.round(amount, decimalPlaces, bigDecimal.RoundingModes.DOWN)
    ).toFixed(decimalPlaces)
  );
};

export const isEqualAddress = (a: string, b: string) => {
  try {
    return getAddress(a) === getAddress(b);
  } catch {
    return false;
  }
};

type SubgraphClienSimilarConfigs =
  | Parameters<SubgraphClient['getLiquidRestakingTokens']>[0]
  | Parameters<SubgraphClient['getDeposits']>[0]
  | Parameters<SubgraphClient['getWithdrawalRequests']>[0]
  | Parameters<SubgraphClient['getOperators']>[0]
  | Parameters<SubgraphClient['getWithdrawalClaims']>[0];

export const buildRioSdkRestakingKey = <T extends SubgraphClienSimilarConfigs>(
  name: string,
  config: T
): [
  name: string,
  orderBy?: string,
  orderDirection?: string,
  page?: number,
  perPage?: number,
  where?: string
] => [
  name,
  config?.orderBy as string | undefined,
  config?.orderDirection as string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  config?.page as number | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  config?.perPage as number | undefined,
  JSON.stringify(config?.where)
];

export const asType = <T>(item: unknown) => item as T;
export const asError = asType<Error>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buildUrlFromSegments = (...segments: (string | string[])[]) => {
  return `/${[segments].flat().filter(Boolean).join('/')}`.replace(/\/+/g, '/');
};

export function hasDuplicateFields<T>(items: T[], field: keyof T) {
  const length = items.length;
  const fields = items.map((item) => item[field]);

  const fieldSet = new Set(fields);
  if (length !== fieldSet.size) return true;

  return false;
}

export function hasDuplicatePubkeys(signingKeys: ValidatorKeyItem[]) {
  return hasDuplicateFields(signingKeys, 'pubkey');
}

export function hasDuplicateSigs(signingKeys: ValidatorKeyItem[]) {
  return hasDuplicateFields(signingKeys, 'signature');
}

export function isHexadecimal(hexString: string, length: number) {
  if (!length) return false;

  const type = typeof hexString;
  if (type !== 'string') return false;

  const regex = new RegExp(`^[a-fA-F0-9]{${length}}$`);
  return regex.test(hexString);
}
