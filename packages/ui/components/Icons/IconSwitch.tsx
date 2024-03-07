import React from 'react';
import { cn } from '../../lib/utilities';

export function IconSwitch({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('[&>path]:stroke-foreground', className)}
      {...props}
    >
      <path
        d="m8.5 11.5 3-3-3-3m3 3h-6m-2-8-3 3 3 3m-3-3h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
