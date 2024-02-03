import React from 'react';
import { cn } from '../../lib/utilities';

export function IconFileKey({
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
        d="M2.66683 6.66634V2.66634C2.66683 2.31272 2.80731 1.97358 3.05735 1.72353C3.3074 1.47348 3.64654 1.33301 4.00016 1.33301H9.66683L13.3335 4.99967V13.333C13.3335 13.6866 13.193 14.0258 12.943 14.2758C12.6929 14.5259 12.3538 14.6663 12.0002 14.6663H2.66683M9.3335 1.33301V5.33301H13.3335M6.66683 6.66634L3.66683 9.66634M6.00016 7.33301L6.66683 7.99967M4.00016 10.6663C4.00016 11.4027 3.40321 11.9997 2.66683 11.9997C1.93045 11.9997 1.3335 11.4027 1.3335 10.6663C1.3335 9.92996 1.93045 9.33301 2.66683 9.33301C3.40321 9.33301 4.00016 9.92996 4.00016 10.6663Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
