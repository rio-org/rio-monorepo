import {
  useQueryClient,
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult
} from '@tanstack/react-query';
import { ACCEPTED_TOS_KEY } from '../lib/constants';
import { storeBoolValueInStorage } from '../lib/utilities';

const QUERY_KEY = [ACCEPTED_TOS_KEY] as const;

type ValueType = boolean | null;

export function useAcceptedTerms(): readonly [
  UseQueryResult<ValueType, Error>,
  UseMutationResult<ValueType, Error, ValueType>
] {
  const fetcher = () => {
    return global.localStorage?.getItem(ACCEPTED_TOS_KEY) === 'true';
  };

  const queryClient = useQueryClient();
  const query = useQuery<ValueType, Error>({
    queryKey: QUERY_KEY,
    queryFn: fetcher,
    staleTime: 1,
    enabled: true
  });

  const mutation = useMutation<ValueType, Error, ValueType>({
    mutationKey: QUERY_KEY,
    mutationFn: storeBoolValueInStorage(ACCEPTED_TOS_KEY, global.localStorage),
    onSuccess: (acceptedTos) => {
      queryClient.setQueryData(QUERY_KEY, acceptedTos);
    }
  });

  return [query, mutation] as const;
}
