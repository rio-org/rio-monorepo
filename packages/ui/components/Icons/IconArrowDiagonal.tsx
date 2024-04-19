import React from 'react';
import { cn } from '../../lib/utilities';

export function IconArrowDiagonal({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('[&>path]:fill-foreground', className)}
      {...props}
    >
      <path d="M2.98588 9.29874L2.20605 8.51465L6.93191 3.78027H3.30975L3.31827 2.70215H8.79412V8.18226H7.70747L7.716 4.5601L2.98588 9.29874Z" />
    </svg>
  );
}
