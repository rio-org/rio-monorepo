import React from 'react';
import { cn } from '../../lib/utilities';

export function IconRocket({
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
        d="M8.00008 9.99984L6.00008 7.99984M8.00008 9.99984C8.93131 9.64567 9.82467 9.19899 10.6667 8.66651M8.00008 9.99984V13.3332C8.00008 13.3332 10.0201 12.9665 10.6667 11.9998C11.3867 10.9198 10.6667 8.66651 10.6667 8.66651M6.00008 7.99984C6.35484 7.07946 6.80155 6.19722 7.33342 5.36651C8.1102 4.1245 9.19183 3.10187 10.4754 2.3959C11.759 1.68993 13.2019 1.32409 14.6667 1.33317C14.6667 3.14651 14.1467 6.33317 10.6667 8.66651M6.00008 7.99984H2.66675C2.66675 7.99984 3.03341 5.97984 4.00008 5.33317C5.08008 4.61317 7.33341 5.33317 7.33341 5.33317M3.00008 10.9998C2.00008 11.8398 1.66675 14.3332 1.66675 14.3332C1.66675 14.3332 4.16008 13.9998 5.00008 12.9998C5.47341 12.4398 5.46675 11.5798 4.94008 11.0598C4.68095 10.8125 4.33961 10.6696 3.98157 10.6585C3.62352 10.6475 3.274 10.769 3.00008 10.9998Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
