import { useQueryClient, useQuery, useMutation } from 'react-query';
import { ACCEPTED_TOS_KEY } from '../lib/constants';
import { storeBoolValueInStorage } from '../lib/utilities';

const QUERY_KEY = [ACCEPTED_TOS_KEY] as const;

export function useAcceptedTerms() {
  const fetcher = () => {
    return global.localStorage?.getItem(ACCEPTED_TOS_KEY) === 'true';
  };

  const queryClient = useQueryClient();
  const query = useQuery<boolean | undefined, Error>(QUERY_KEY, fetcher, {
    staleTime: 1,
    enabled: true
  });

  const mutation = useMutation({
    mutationKey: QUERY_KEY,
    mutationFn: storeBoolValueInStorage(ACCEPTED_TOS_KEY, global.localStorage),
    onSuccess: (acceptedTos) => {
      queryClient.setQueryData(QUERY_KEY, acceptedTos);
    }
  });

  return [query, mutation] as const;
}
