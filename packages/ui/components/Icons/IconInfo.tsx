import React from 'react';
import { cn } from '../../lib/utilities';

export function IconInfo({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('[&>path]:stroke-foregroundA8', className)}
      {...props}
    >
      <path
        d="M6 7.99951V5.99951M6 3.99951H6.005M11 5.99951C11 8.76094 8.76142 10.9995 6 10.9995C3.23858 10.9995 1 8.76094 1 5.99951C1 3.23809 3.23858 0.999512 6 0.999512C8.76142 0.999512 11 3.23809 11 5.99951Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
