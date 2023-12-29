import React, { useEffect, useRef } from 'react'


export const useOutsideClick = (callback: () => void, removeListener: boolean) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    if (removeListener) {
      return () => {
        document.removeEventListener('click', handleClick, true);
      };
    } else {
      document.addEventListener('click', handleClick, true);
      return () => {
        document.removeEventListener('click', handleClick, true);
      };
    }
  }, [ref, removeListener]);

  return ref;
}