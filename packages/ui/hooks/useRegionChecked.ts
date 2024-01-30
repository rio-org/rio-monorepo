import { useQueryClient, useQuery, useMutation } from 'react-query';
import { REGION_CHECKED_SESSION_KEY } from '../lib/constants';
import { storeBoolValueInStorage } from '../lib/utilities';
import { useEffect, useState } from 'react';

const QUERY_KEY = [REGION_CHECKED_SESSION_KEY] as const;

export function useRegionChecked() {
  const [storage, setStorage] = useState<Storage>();
  useEffect(() => setStorage(localStorage), []);

  const queryClient = useQueryClient();
  const query = useQuery<boolean | undefined, Error>(
    QUERY_KEY,
    () => {
      const item = storage?.getItem(REGION_CHECKED_SESSION_KEY);
      if (!item) return undefined;
      return item === 'true';
    },
    { staleTime: 0, enabled: true }
  );

  const mutation = useMutation({
    mutationKey: QUERY_KEY,
    mutationFn: async () => {
      const { status } = (await fetch('/api/geofence')) || { status: 500 };
      const storeFxn = storeBoolValueInStorage(
        REGION_CHECKED_SESSION_KEY,
        storage
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
