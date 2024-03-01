import {
  useQueryClient,
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult
} from '@tanstack/react-query';
import { REGION_CHECKED_SESSION_KEY } from '../lib/constants';
import { storeBoolValueInStorage } from '../lib/utilities';

const QUERY_KEY = [REGION_CHECKED_SESSION_KEY] as const;

type ValueType = boolean | undefined;

export function useRegionChecked(): readonly [
  UseQueryResult<ValueType, Error>,
  UseMutationResult<ValueType, Error, ValueType>
] {
  const queryClient = useQueryClient();

  const queryFn = () => {
    const item = global.localStorage?.getItem(REGION_CHECKED_SESSION_KEY);
    if (!item) return undefined;
    return item === 'true';
  };

  const query = useQuery<ValueType, Error>({
    queryKey: QUERY_KEY,
    queryFn,
    staleTime: 1,
    enabled: true
  });

  const mutation = useMutation<ValueType, Error, ValueType>({
    mutationKey: QUERY_KEY,
    mutationFn: async (checkRegionLock) => {
      const storeFxn = storeBoolValueInStorage(
        REGION_CHECKED_SESSION_KEY,
        global.localStorage
      );

      if (checkRegionLock === false) {
        return await storeFxn(false);
      }

      const { status } = (await fetch('/api/geofence')) || { status: 500 };

      if (status >= 400 && status !== 451) {
        throw new Error('Could not check region');
      }

      return await storeFxn(status !== 451);
    },
    onSuccess: (regionChecked) => {
      queryClient.setQueryData(QUERY_KEY, regionChecked);
    }
  });

  return [query, mutation] as const;
}
