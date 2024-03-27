import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type Address, formatUnits, getAddress, zeroAddress } from 'viem';
import { ASSETS, ASSET_LOGOS } from './constants';
import {
  type AssetDetails,
  type AssetSubgraphResponse,
  type BaseAssetDetails,
  type BaseAssetSubgraphResponse,
  type BaseLRTSubgraphResponse,
  type ContractError,
  type LRTDetails,
  type LRTSubgraphResponse,
  type TokenSymbol,
  type UnderlyingAssetDetails,
  type UnderlyingAssetSubgraphResponse,
  type ValidatorKeyItem
} from './typings';
import dayjs from 'dayjs';
import bigDecimal from 'js-big-decimal';
import { CHAIN_ID, NATIVE_ETH_ADDRESS } from '../config';
import { type SubgraphClient } from '@rionetwork/sdk-react';
import {
  base,
  baseGoerli,
  foundry,
  goerli,
  holesky,
  mainnet,
  optimism,
  optimismGoerli,
  sepolia,
  zora,
  zoraSepolia
} from 'viem/chains';

export const getChainName = (chainId: number) => {
  [mainnet, sepolia, goerli, optimism];
  switch (chainId) {
    case mainnet.id:
      return mainnet.name;
    case goerli.id:
      return goerli.name;
    case sepolia.id:
      return sepolia.name;
    case holesky.id:
      return holesky.name;
    case optimism.id:
      return optimism.name;
    case optimismGoerli.id:
      return optimismGoerli.name;
    case base.id:
      return base.name;
    case baseGoerli.id:
      return baseGoerli.name;
    case zora.id:
      return zora.name;
    case 999:
      return 'Zora Goerli';
    case zoraSepolia.id:
      return zoraSepolia.name;
    case foundry.id:
      return foundry.name;
    default:
      return 'Unknown';
  }
};

export const getAlchemyChainLabel = (chainId: number) => {
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

export const getInfuraChainLabel = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'mainnet';
    case 5:
      return 'goerli';
    case 11155111:
      return 'sepolia';
    default:
      return 'unknown';
  }
};
export const getAnkrChainParam = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'eth';
    case 11155111:
      return 'eth_sepolia';
    case 17000:
      return 'eth_holesky';
    default:
      return 'unknown';
  }
};

export const getAlchemyRpcUrl = (chainId: number) => {
  const subdomain = getAlchemyChainLabel(chainId);
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID;
  if (subdomain === 'unknown' || !apiKey) return '';
  return `https://${subdomain}.g.alchemy.com/v2/${apiKey}`;
};

export const getInfuraRpcUrl = (chainId: number) => {
  const subdomain = getInfuraChainLabel(chainId);
  const apiKey = process.env.NEXT_PUBLIC_INFURA_ID;
  if (subdomain === 'unknown' || !apiKey) return '';
  return `https://${subdomain}.infura.io/v3/${apiKey}`;
};

export const getAnkrRpcUrl = (chainId: number) => {
  const param = getAnkrChainParam(chainId);
  const apiKey = process.env.NEXT_PUBLIC_ANKR_ID;
  if (param === 'unknown' || !apiKey) return '';
  return `https://rpc.ankr.com/${param}/${apiKey}`;
};

export const linkToAddressOnBlockExplorer = (
  address: Address,
  chainId: number = CHAIN_ID
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

export const linkToTxOnBlockExplorer = (
  address: Address,
  chainId: number = CHAIN_ID
) => {
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
  const truncced = truncDec(+formatUnits(amount, tokenDecimals), tokenDecimals);
  if (isSafe && truncced < 0.001) {
    return truncced;
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

export const displayAmount = (
  amount: number,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 3
) => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits
  });
};

export const displayEthAmount = (amount: string, digits: number = 3) => {
  if (!amount || /^0+(\.0+)?$/.test(amount)) {
    return '0';
  }

  const parsedAmount = parseFloat(new bigDecimal(amount).getValue());
  const rounded = parseFloat(
    bigDecimal.round(amount, digits, bigDecimal.RoundingModes.DOWN)
  );

  const truncLimit =
    1 /
    Array(digits)
      .fill(10)
      .reduce((a, b) => a * b);

  return parsedAmount < truncLimit
    ? `<${truncLimit.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      })}`
    : displayAmount(rounded, 0, digits);
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
  | Parameters<SubgraphClient['getOperatorDelegators']>[0]
  | Parameters<SubgraphClient['getWithdrawalClaims']>[0];

export const buildRioSdkRestakingKey = <T extends SubgraphClienSimilarConfigs>(
  name: string,
  chainId: number | undefined,
  config: T
): [
  name: string,
  chainId: number | undefined,
  orderBy?: string,
  orderDirection?: string,
  page?: number,
  perPage?: number,
  where?: string
] => [
  name,
  chainId,
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
export const asContractError = asType<ContractError>;

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

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export const storeBoolValueInStorage = (key: string, store?: Storage) => {
  return async (value: boolean | null) =>
    new Promise<boolean | null>((resolve) => {
      try {
        store?.setItem(key, String(value));
        return resolve(value);
      } catch (e) {
        return resolve(null);
      }
    });
};

export const stripTokenDecimals = (amount: string, decimals: number = 18) => {
  const normalized = amount.replace(/[^0-9.]/g, '');
  const pointIdx = normalized.indexOf('.');
  const whole = normalized.match(/^\d+/)?.[0] ?? '';
  return !~pointIdx
    ? normalized
    : `${whole}.${normalized.slice(pointIdx + 1, pointIdx + decimals + 1)}`;
};

export function abbreviateAddress(
  address?: string | null,
  config?: {
    startChars?: boolean | number;
    lastChars?: boolean | number;
  }
) {
  const { startChars = 6, lastChars = 4 } = config || {};
  const startCharCount =
    typeof startChars === 'number' ? startChars : startChars ? 6 : 0;
  const _startChars = !startCharCount ? '' : address?.slice(0, startCharCount);
  const lastCharCount =
    typeof lastChars === 'number' ? lastChars : lastChars ? 4 : 0;
  const _lastChars = !lastCharCount ? '' : address?.slice(-lastCharCount);
  const ellipsis = _startChars && _lastChars ? '...' : '';
  return address ? `${_startChars}${ellipsis}${_lastChars}` : null;
}
