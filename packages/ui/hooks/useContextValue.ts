'use client';

import { useMemo } from 'react';

export const useContextValue = <T extends { [k: string]: unknown }>(
  contextValues: T
): T => {
  const entriesByName = useMemo(
    () =>
      Object.entries(contextValues).sort(([a], [b]) =>
        JSON.stringify(a).localeCompare(JSON.stringify(b))
      ),
    [contextValues]
  );
  return useMemo<T>(
    () => Object.fromEntries(entriesByName) as T,
    Object.values(entriesByName.map(([, value]) => value))
  );
};
