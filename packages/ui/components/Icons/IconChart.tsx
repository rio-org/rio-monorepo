import React from 'react';
import { cn } from '../../lib/utilities';

export function IconChart({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('[&>path]:stroke-foreground', className)}
      {...props}
    >
      <path
        d="M2 2.5V14.5H14M12.6667 6.5L9.33333 9.83333L6.66667 7.16667L4.66667 9.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
