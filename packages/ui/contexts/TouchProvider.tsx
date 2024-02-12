import {
  useContext,
  createContext,
  useEffect,
  useState,
  PropsWithChildren
} from 'react';

const TouchContext = createContext<boolean | undefined>(undefined);
export const useIsTouch = () => useContext(TouchContext);

export const TouchProvider = (props: PropsWithChildren) => {
  const [isTouch, setTouch] = useState<boolean>();

  useEffect(() => {
    const handler = () => {
      const newIsTouch = window.matchMedia('(pointer: coarse)').matches;
      if (newIsTouch !== isTouch) setTouch(newIsTouch);
    };
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [isTouch]);

  return <TouchContext.Provider value={isTouch} {...props} />;
};
