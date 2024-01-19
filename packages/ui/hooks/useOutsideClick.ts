import { useEffect, useRef } from 'react';

export const useOutsideClick = (
  callback: () => void,
  removeListener: boolean
) => {
  const ref = useRef<HTMLDivElement>(null);
  const win = window as Window;
  const doc = win.document;

  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    if (removeListener) {
      return () => {
        doc.removeEventListener('click', handleClick, true);
      };
    } else {
      doc.addEventListener('click', handleClick, true);
      return () => {
        doc.removeEventListener('click', handleClick, true);
      };
    }
  }, [ref, removeListener]);

  return ref;
};
