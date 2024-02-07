import { useEffect, useRef } from 'react';

export const useOutsideClick = <T extends HTMLElement = HTMLDivElement>(
  callback: () => void,
  removeListener: boolean,
  passedRef?: React.RefObject<T>
) => {
  const internalRef = useRef<T>(null);
  const ref = passedRef || internalRef;

  useEffect(() => {
    const d = window.document;
    const handleClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) {
        callback();
      }
    };

    if (!removeListener) d.addEventListener('click', handleClick, true);
    return () => d.removeEventListener('click', handleClick, true);
  }, [ref, removeListener]);

  return ref;
};
