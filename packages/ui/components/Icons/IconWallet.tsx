import React from 'react';
import { cn } from '../../lib/utilities';

export function IconWallet({
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
        d="M10 6V4H3C2.73478 4 2.48043 3.89464 2.29289 3.70711C2.10536 3.51957 2 3.26522 2 3M2 3C2 2.45 2.45 2 3 2H9V4M2 3V9C2 9.55 2.45 10 3 10H10V8M9 6C8.73478 6 8.48043 6.10536 8.29289 6.29289C8.10536 6.48043 8 6.73478 8 7C8 7.55 8.45 8 9 8H11V6H9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
