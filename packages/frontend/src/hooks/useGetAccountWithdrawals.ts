import { EthereumAddress } from '../lib/typings';
import { useEffect, useState } from 'react';
import { WithdrawalRequest, useSubgraph } from '@rionetwork/sdk-react';

export const useGetAccountWithdrawals = (address: EthereumAddress) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<Error>();
  const [data, setData] = useState<WithdrawalRequest[]>();

  const subgraph = useSubgraph();

  useEffect(() => {
    if (!subgraph) return;

    setIsLoading(true);
    const withdrawalRequestsPromise = subgraph.getWithdrawalRequests({
      where: { sender: address }
    });

    withdrawalRequestsPromise
      .then(setData)
      .catch((e: Error) => (console.error(e), setIsError(e)))
      .finally(() => setIsLoading(false));
  }, []);

  return {
    data,
    isLoading,
    isError
  };
};
