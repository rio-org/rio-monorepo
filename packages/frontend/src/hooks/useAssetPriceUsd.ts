import { ethInUSD } from '../../placeholder';

// TODO: Implement this hook
export const useAssetPriceUsd = (address?: string) => {
  return !address ? 0 : ethInUSD;
};
