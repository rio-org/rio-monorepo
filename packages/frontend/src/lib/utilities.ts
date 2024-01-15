import { formatUnits, zeroAddress } from 'viem';
import { ASSETS, ASSET_LOGOS } from './constants';
import {
  AssetDetails,
  AssetSubgraphResponse,
  CHAIN_ID_NUMBER,
  EthereumAddress,
  LRTDetails,
  LRTSubgraphResponse,
  TokenSymbol,
  UnderlyingAssetDetails,
  UnderlyingAssetSubgraphResponse
} from './typings';
import dayjs from 'dayjs';
import bigDecimal from 'js-big-decimal';
import { CHAIN_ID, NATIVE_ETH_ADDRESS } from '../../config';

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
  address: EthereumAddress,
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

export const linkToTxOnBlockExplorer = (
  address: EthereumAddress,
  chainId: number
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

export const parseSubgraphAsset = (asset: AssetSubgraphResponse) => {
  return <AssetDetails>{
    name: asset.name,
    symbol: asset.symbol,
    address: asset.address || NATIVE_ETH_ADDRESS,
    logo: ASSET_LOGOS[asset.symbol],
    decimals: asset.decimals ?? 18,
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
    name: lrt.name,
    symbol: lrt.symbol,
    address: lrt.address || zeroAddress,
    logo: ASSET_LOGOS[lrt.symbol],
    decimals: /USD/i.test(lrt.symbol) ? 6 : 18,
    totalSupply: Number(lrt.totalSupply),
    percentAPY: Number(lrt.percentAPY),
    totalValueUSD: Number(lrt.totalValueUSD),
    totalValueETH: Number(lrt.totalValueETH),
    underlyingAssets: lrt.underlyingAssets.map(parseUnderlyingAsset)
  };
};

export const parseSubgraphAssetList = (
  data: AssetSubgraphResponse[]
): AssetDetails[] => {
  return JSON.parse(
    JSON.stringify(data.map(parseSubgraphAsset))
  ) as AssetDetails[];
};

export const parseSubgraphUnderlyingAsset = (
  data: UnderlyingAssetSubgraphResponse[]
): UnderlyingAssetDetails[] => {
  return JSON.parse(
    JSON.stringify(data.map(parseUnderlyingAsset))
  ) as UnderlyingAssetDetails[];
};

export const parseSubgraphLRTList = (
  data: LRTSubgraphResponse[]
): LRTDetails[] => {
  return JSON.parse(JSON.stringify(data.map(parseSubgraphLRT))) as LRTDetails[];
};

export const displayEthAmount = (amount: string) => {
  const decimalPlaces = CHAIN_ID === 1 ? 2 : 3;
  return parseFloat(
    parseFloat(
      bigDecimal.round(amount, decimalPlaces, bigDecimal.RoundingModes.DOWN)
    ).toFixed(decimalPlaces)
  );
};
