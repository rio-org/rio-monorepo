'use client';

import { useMediaQuery } from 'react-responsive';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';
import { MOBILE_MQ } from '../../lib/constants';
import { cn } from '../../lib/utilities';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  const isMobile = useMediaQuery({ query: MOBILE_MQ });
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: cn(
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
            isMobile && 'group-[.toaster]:bottom-[80px]'
          ),
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
