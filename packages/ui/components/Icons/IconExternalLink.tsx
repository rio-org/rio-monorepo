import React from 'react';
import { cn } from '../../lib/utilities';

export function IconSocialX({
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
      className={cn('[&>path]:fill-foregroundA6', className)}
      {...props}
    >
      <path
        d="M8.7628 6.64449L13.6714 0.999512H12.5086L8.24468 5.89996L4.84158 0.999512H0.915527L6.06281 8.41057L0.915527 14.3295H2.07831L6.57829 9.15332L10.173 14.3295H14.099M2.49799 1.86701H4.28436L12.5078 13.5046H10.721"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
