import React from 'react';
import { cn } from '../../lib/utilities';

export function IconCalendarClock({
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
        d="M14 4.99967V3.99967C14 3.64605 13.8595 3.30691 13.6095 3.05687C13.3594 2.80682 13.0203 2.66634 12.6667 2.66634H3.33333C2.97971 2.66634 2.64057 2.80682 2.39052 3.05687C2.14048 3.30691 2 3.64605 2 3.99967V13.333C2 13.6866 2.14048 14.0258 2.39052 14.2758C2.64057 14.5259 2.97971 14.6663 3.33333 14.6663H5.66667M10.6667 1.33301V3.99967M5.33333 1.33301V3.99967M2 6.66634H5.33333M11.6667 11.6663L10.6667 10.833V9.33301M14.6667 10.6663C14.6667 11.7272 14.2452 12.7446 13.4951 13.4948C12.7449 14.2449 11.7275 14.6663 10.6667 14.6663C9.6058 14.6663 8.58839 14.2449 7.83824 13.4948C7.08809 12.7446 6.66667 11.7272 6.66667 10.6663C6.66667 9.60547 7.08809 8.58806 7.83824 7.83791C8.58839 7.08777 9.6058 6.66634 10.6667 6.66634C11.7275 6.66634 12.7449 7.08777 13.4951 7.83791C14.2452 8.58806 14.6667 9.60547 14.6667 10.6663Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}