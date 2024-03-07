import React from 'react';
import { TransactionStatus } from '../../lib/typings';
import { cn } from '../../lib/utilities';

type Props = {
  transactionStatus?: TransactionStatus;
  className?: string;
};

const IconExternal = ({ transactionStatus = 'None', className }: Props) => {
  const colorYellow = '[&>path]:stroke-warning-foreground';
  const colorGreen = '[&>path]:stroke-green';
  const colorBlue = '[&>path]:stroke-rio-blue';
  const colorForeground = '[&>path]:stroke-foreground';
  const colorClassName = (transactionStatus: TransactionStatus) => {
    if (transactionStatus === 'Pending') return colorYellow;
    if (transactionStatus === 'Available') return colorGreen;
    if (transactionStatus === 'Claimed') return colorBlue;
    return colorForeground;
  };

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(colorClassName(transactionStatus), className)}
    >
      <path
        d="M9.5 8.5V10C9.5 10.3978 9.34196 10.7794 9.06066 11.0607C8.77936 11.342 8.39782 11.5 8 11.5H2C1.60218 11.5 1.22064 11.342 0.93934 11.0607C0.658035 10.7794 0.5 10.3978 0.5 10V4C0.5 3.60218 0.658035 3.22064 0.93934 2.93934C1.22064 2.65804 1.60218 2.5 2 2.5H3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 0.5H11.5V5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 0.5L5.5 6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconExternal;
