import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useSupportedChainId } from './useSupportedChainId';
import { type RewardsResponse } from '../lib/typings';
import { API_URL } from '../config';

const buildFetcher = (
  restakingToken?: string,
  chainId?: number
): (() => Promise<RewardsResponse>) | undefined => {
  if (!restakingToken || !chainId) {
    return;
  }

  return async () => {
    const response = await fetch(
      `${API_URL}/rewards/${restakingToken}/chain/${chainId}/protocol`
    );

    if (response.ok) return response.json();

    return {
      eth_rewards_in_period: '0',
      yearly_rewards_percent: '0'
    };
  };
};

export function useProtocolRewards({
  restakingToken,
  chainId
}: {
  restakingToken?: string;
  chainId?: number;
}): UseQueryResult<RewardsResponse | undefined, Error> {
  const supportedChainId = useSupportedChainId();
  const _chainId = chainId || supportedChainId;
  const query = useQuery<RewardsResponse, Error>({
    queryKey: ['protocol-rewards', restakingToken, _chainId],
    queryFn: buildFetcher(restakingToken, _chainId),
    enabled: !!restakingToken && !!_chainId,
    staleTime: 60000
  });

  if (!restakingToken) {
    return { ...query, data: undefined };
  }

  return query;
}
