import React from 'react';
import { cn } from '../../lib/utilities';

export function IconKeyShift({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('[&>path]:stroke-foreground', className)}
      {...props}
    >
      <path
        d="M14.7398 9.62321H13.7398V10.6232V14.4346C13.7398 14.7469 13.4867 15 13.1745 15H6.87439C6.56214 15 6.309 14.7469 6.309 14.4346V10.6232V9.62321H5.309H1.99008C1.70142 9.62321 1.55637 9.27456 1.75981 9.06983L1.75981 9.06982L9.68328 1.09573C9.80916 0.969076 10.0139 0.9679 10.1413 1.09338L10.1413 1.0934L18.2375 9.06725C18.2375 9.06728 18.2375 9.0673 18.2375 9.06733C18.4445 9.27133 18.2999 9.62321 18.0098 9.62321H14.7398Z"
        strokeLinecap="round"
        strokeWidth={2}
      />
    </svg>
  );
}
