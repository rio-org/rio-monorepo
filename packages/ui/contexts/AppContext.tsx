'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

import { useActionKey } from '../hooks/useActionKey';
import { useContextValue } from '../hooks/useContextValue';

import type {
  HotKeys,
  HotKeyString,
  MousePosition,
  WindowSize
} from '../lib/typings';

type Subscriptions = Omit<Record<keyof AppContextState['values'], number>, ''>;

export interface AppContextState {
  values: {
    windowSize: WindowSize;
    mousePosition: MousePosition;
  };
  hotkeys: HotKeys;
  setHotkeys: React.Dispatch<React.SetStateAction<HotKeys>>;
  subscriptions: Subscriptions;
  subscribe: (key: keyof Subscriptions) => void;
  unsubscribe: (key: keyof Subscriptions) => void;
}

const defaultState: AppContextState = {
  values: {
    windowSize: {
      width: 0,
      height: 0
    },
    mousePosition: {
      clientX: 0,
      clientY: 0
    }
  },
  hotkeys: {},
  subscriptions: {
    windowSize: 0,
    mousePosition: 0
  },
  setHotkeys() {},
  subscribe() {},
  unsubscribe() {}
};

const AppContext = createContext<AppContextState>(defaultState);

export function AppContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [{ os }] = useActionKey();

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0
  });
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    clientX: 0,
    clientY: 0
  });
  const [subscriptions, setSubscriptions] = useState<Subscriptions>({
    windowSize: 0,
    mousePosition: 0
  });

  const [hotkeys, setHotkeys] = useState<HotKeys>({});

  const subscribe = useCallback((key: keyof Subscriptions) => {
    setSubscriptions((subs) => ({ ...subs, [key]: (subs[key] ?? 0) + 1 }));
  }, []);

  const unsubscribe = useCallback((key: keyof Subscriptions) => {
    setSubscriptions((subs) => ({ ...subs, [key]: (subs[key] ?? 0) - 1 }));
  }, []);

  useEffect(() => {
    function handleResize() {
      console.log('resize');
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    function handleMouseMove(event: MouseEvent) {
      setMousePosition({ clientX: event.clientX, clientY: event.clientY });
    }

    function handleHotKey(event: KeyboardEvent) {
      if (event.key.length > 1) return;
      const hotKeyString = deriveHotKeyString({
        shift: event.shiftKey,
        alt: event.altKey,
        action: os === 'mac' ? event.metaKey : event.ctrlKey,
        character: event.key
      });
      hotkeys[hotKeyString]?.();
    }

    if (subscriptions['windowSize']) {
      window.addEventListener('resize', handleResize);
    }

    if (subscriptions['mousePosition']) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    if (Object.values(hotkeys).filter(Boolean).length) {
      window.addEventListener('keydown', handleHotKey);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleHotKey);
    };
  }, [os, subscriptions, hotkeys]);

  return (
    <AppContext.Provider
      value={useContextValue({
        values: { windowSize, mousePosition, hotkeys },
        hotkeys,
        setHotkeys,
        subscriptions,
        subscribe,
        unsubscribe
      })}
    >
      {children}
    </AppContext.Provider>
  );
}

function useAppContextValue<T extends keyof AppContextState['values']>(key: T) {
  return useContext(AppContext).values[key];
}

function useSubscription<T extends keyof Subscriptions>(
  key: T
): AppContextState['values'][T] {
  const { subscribe, unsubscribe } = useContext(AppContext);

  useEffect(() => {
    subscribe(key);
    return () => unsubscribe(key);
  }, [subscribe, unsubscribe, key]);

  return useAppContextValue(key);
}

function deriveHotKeyString({
  shift,
  alt,
  action,
  character
}: {
  shift?: boolean;
  alt?: boolean;
  action?: boolean;
  character?: string;
}): HotKeyString {
  const shiftString = shift ? 'shift' : 'no-shift';
  const altString = alt ? 'alt' : 'no-alt';
  const actionString = action ? 'action' : 'no-action';
  const keyString = character?.toLowerCase();
  return `${actionString}+${shiftString}+${altString}+${keyString}` as HotKeyString;
}

export function useRegisterHotKey({
  shift,
  alt,
  action,
  character,
  callback,
  enable = true
}: {
  shift?: boolean;
  alt?: boolean;
  action?: boolean;
  character?: string;
  callback?: () => void;
  enable?: boolean;
}): void {
  const { setHotkeys } = useContext(AppContext);
  const hotKeyString = deriveHotKeyString({ shift, alt, action, character });

  useEffect(() => {
    if (!enable || !character || !callback) return;

    setHotkeys((hotkeys) => ({ ...hotkeys, [hotKeyString]: callback }));

    return () =>
      setHotkeys((hotkeys) => {
        const _hotkeys = { ...hotkeys };
        delete _hotkeys[hotKeyString];
        return _hotkeys;
      });
  }, [hotKeyString, callback, character, enable]);
}

export function useWindowSize() {
  return useSubscription('windowSize');
}

export function useMousePosition() {
  return useSubscription('mousePosition');
}
