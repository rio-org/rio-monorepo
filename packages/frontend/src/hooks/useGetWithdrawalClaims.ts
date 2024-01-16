import { WithdrawalClaim, useSubgraph } from '@rionetwork/sdk-react';
import { EthereumAddress } from '../lib/typings';
import { useEffect, useState } from 'react';

export const useGetWithdrawalClaims = (address?: EthereumAddress) => {
  const subgraph = useSubgraph();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<Error>();
  const [data, setData] = useState<WithdrawalClaim[]>();

  useEffect(() => {
    if (!address) return;
    setIsLoading(true);
    subgraph
      .getWithdrawalClaims({ where: { sender: address } })
      .then(setData)
      .catch((e: Error) => (console.error(e), setIsError(e)))
      .finally(() => setIsLoading(false));
  }, [address]);

  return {
    data,
    isLoading,
    isError
  };
};
