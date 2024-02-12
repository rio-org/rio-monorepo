import { TooltipProvider } from '@radix-ui/react-tooltip';
import { useContext, createContext, useEffect, useState } from 'react';

const TouchContext = createContext<boolean | undefined>(undefined);
export const useTouch = () => useContext(TouchContext);

export const TouchProvider = ({
  children
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const [isTouch, setTouch] = useState<boolean>();

  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  if (!isTouch) {
    return;
  }

  return (
    <TouchContext.Provider value={isTouch}>
      <TooltipProvider>{children}</TooltipProvider>
    </TouchContext.Provider>
  );
};
