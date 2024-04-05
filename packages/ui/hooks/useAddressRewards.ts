import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useSupportedChainId } from './useSupportedChainId';
import { useAccountIfMounted } from './useAccountIfMounted';
import { type RewardsResponse } from '../lib/typings';
import { API_URL } from '../config';
import { type Address } from 'viem';

const buildFetcher = (
  restakingToken?: string,
  chainId?: number,
  address?: Address
): (() => Promise<RewardsResponse>) | undefined => {
  if (!restakingToken || !chainId || !address) {
    return;
  }

  return async () => {
    const response = await fetch(
      `${API_URL}/rewards/${restakingToken}/chain/${chainId}/address/${address}`
    );

    if (response.ok) return response.json();

    return {
      eth_rewards_in_period: '0',
      yearly_rewards_percent: '0'
    };
  };
};

export function useAddressRewards({
  restakingToken,
  address,
  chainId
}: {
  restakingToken?: string;
  address?: Address;
  chainId?: number;
}): UseQueryResult<RewardsResponse, Error> {
  const { address: connectedAddress } = useAccountIfMounted();
  const supportedChainId = useSupportedChainId();
  const _chainId = chainId || supportedChainId;
  const _address = address || connectedAddress;
  return useQuery<RewardsResponse, Error>({
    queryKey: ['protocol-rewards', _chainId],
    queryFn: buildFetcher(restakingToken, _chainId, _address),
    enabled: !!_address && !!restakingToken && !!_chainId,
    staleTime: 60000
  });
}
