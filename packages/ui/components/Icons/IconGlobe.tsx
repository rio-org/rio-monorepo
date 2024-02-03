import React from 'react';
import { cn } from '../../lib/utilities';

export function IconGlobe({
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
      className={cn('[&>path]:stroke-gray-500', className)}
      {...props}
    >
      <path
        d="M14.6668 7.99967C14.6668 11.6816 11.6821 14.6663 8.00016 14.6663M14.6668 7.99967C14.6668 4.31778 11.6821 1.33301 8.00016 1.33301M14.6668 7.99967H1.3335M8.00016 14.6663C4.31826 14.6663 1.3335 11.6816 1.3335 7.99967M8.00016 14.6663C9.66768 12.8408 10.6153 10.4717 10.6668 7.99967C10.6153 5.5277 9.66768 3.15858 8.00016 1.33301M8.00016 14.6663C6.33264 12.8408 5.38499 10.4717 5.3335 7.99967C5.38499 5.5277 6.33264 3.15858 8.00016 1.33301M1.3335 7.99967C1.3335 4.31778 4.31826 1.33301 8.00016 1.33301"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
