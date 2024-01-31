import { useQueryClient, useQuery, useMutation } from 'react-query';
import { REGION_CHECKED_SESSION_KEY } from '../lib/constants';
import { storeBoolValueInStorage } from '../lib/utilities';

const QUERY_KEY = [REGION_CHECKED_SESSION_KEY] as const;

export function useRegionChecked() {
  const queryClient = useQueryClient();

  const fetcher = () => {
    const item = global.localStorage?.getItem(REGION_CHECKED_SESSION_KEY);
    if (!item) return undefined;
    return item === 'true';
  };

  const query = useQuery<boolean | undefined, Error>(QUERY_KEY, fetcher, {
    staleTime: 1,
    enabled: true
  });

  const mutation = useMutation({
    mutationKey: QUERY_KEY,
    mutationFn: async () => {
      const { status } = (await fetch('/api/geofence')) || { status: 500 };
      const storeFxn = storeBoolValueInStorage(
        REGION_CHECKED_SESSION_KEY,
        global.localStorage
      );

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
