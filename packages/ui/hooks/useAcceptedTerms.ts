import { useQueryClient, useQuery, useMutation } from 'react-query';
import { ACCEPTED_TOS_KEY } from '../lib/constants';
import { storeBoolValueInStorage } from '../lib/utilities';
import { useEffect, useState } from 'react';

const QUERY_KEY = [ACCEPTED_TOS_KEY] as const;

export function useAcceptedTerms() {
  const [storage, setStorage] = useState<Storage>();
  useEffect(() => setStorage(localStorage), []);

  const queryClient = useQueryClient();
  const query = useQuery<boolean | undefined, Error>(
    QUERY_KEY,
    () => storage?.getItem(ACCEPTED_TOS_KEY) === 'true',
    { staleTime: 1, enabled: true }
  );

  const mutation = useMutation({
    mutationKey: QUERY_KEY,
    mutationFn: storeBoolValueInStorage(ACCEPTED_TOS_KEY, storage),
    onSuccess: (acceptedTos) => {
      queryClient.setQueryData(QUERY_KEY, acceptedTos);
    }
  });

  return [query, mutation] as const;
}
