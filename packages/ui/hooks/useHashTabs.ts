import { useRouter } from 'next/router';
import { useCallback } from 'react';

export type HashTabs<T> = {
  [key: string]: T;
  index: T;
};

export function useHashTabs<T extends string = string>(
  tabs: HashTabs<T>
): [T, (value: T) => void] {
  const { push, asPath } = useRouter();
  const tabKey: keyof HashTabs<T> =
    asPath.split('#')[1]?.toLowerCase() || 'index';

  const tab = tabs[tabKey] || tabs.index;
  const setTab = useCallback(
    (nextTab: T) => void push({ hash: nextTab.toLowerCase() }),
    [push]
  );

  return [tab, setTab];
}
