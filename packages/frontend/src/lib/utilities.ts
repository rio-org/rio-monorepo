import { formatUnits } from 'viem';
import { ASSETS } from './constants';
import { CHAIN_ID_NUMBER, EthereumAddress, TokenSymbol } from './typings';
import dayjs from 'dayjs';
import bigDecimal from 'js-big-decimal';
import { CHAIN_ID } from '../../config';

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

export const displayEthAmount = (amount: string) => {
  const decimalPlaces = CHAIN_ID === 1 ? 2 : 3;
  return parseFloat(
    parseFloat(
      bigDecimal.round(amount, decimalPlaces, bigDecimal.RoundingModes.DOWN)
    ).toFixed(decimalPlaces)
  );
};