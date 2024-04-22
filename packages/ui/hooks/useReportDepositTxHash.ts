import { Hash } from 'viem';
import { API_URL } from '../config';
import { useEffect, useRef } from 'react';
import { useSupportedChainId } from './useSupportedChainId';

const submitDepositTxHash = async (
  token: string,
  hash: Hash,
  chainId: number
) => {
  const response = await fetch(
    `${API_URL}/dapp/${token}/${chainId}/deposit/${hash}`
  );
  if (!response.ok) {
    throw new Error(`Failed to submit deposit tx hash: ${hash}`);
  }
};

export const useReportDepositTxHash = ({
  token,
  hash,
  chainId
}: {
  token?: string;
  hash?: Hash;
  chainId?: number;
}) => {
  const alreadyCalledRef = useRef<{
    [tokenDashChainIdDashHash: string]: boolean;
  }>({});
  const supportedChainId = useSupportedChainId();
  const _chainId = chainId || supportedChainId;

  useEffect(() => {
    if (!hash || !token) return;
    if (alreadyCalledRef.current[`${token}-${_chainId}-${hash}`]) return;
    submitDepositTxHash(token, hash, _chainId)
      .then(() => {
        alreadyCalledRef.current[`${token}-${chainId}-${hash}`] = true;
      })
      .catch(console.error);
  }, [alreadyCalledRef, token, _chainId, hash]);
};
