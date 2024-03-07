import React from 'react';
import { cn } from '../../lib/utilities';

export function IconCloudArrowDown({
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
      className={cn('[&>path]:stroke-foregroundA8', className)}
      {...props}
    >
      <path
        d="M2.66657 9.93235C2.17126 9.4263 1.79761 8.81416 1.57392 8.14231C1.35023 7.47046 1.28237 6.75652 1.37547 6.05455C1.46858 5.35259 1.7202 4.68102 2.1113 4.09071C2.50239 3.5004 3.02269 3.00683 3.63279 2.64739C4.24289 2.28795 4.92679 2.07206 5.63268 2.01607C6.33857 1.96009 7.04795 2.06548 7.70708 2.32426C8.36621 2.58304 8.9578 2.98843 9.43706 3.50971C9.91631 4.031 10.2706 4.65451 10.4732 5.33302H11.6666C12.3102 5.33295 12.9369 5.5399 13.4539 5.92331C13.9709 6.30673 14.3509 6.84626 14.5377 7.46222C14.7246 8.07819 14.7084 8.73791 14.4915 9.34394C14.2746 9.94997 13.8685 10.4702 13.3332 10.8277M7.9999 7.99969V13.9997M7.9999 13.9997L5.33323 11.333M7.9999 13.9997L10.6666 11.333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
