import React from 'react';
import { TransactionStatus } from '../../lib/typings';

type Props = {
  transactionStatus: TransactionStatus;
};

const IconExternal = ({ transactionStatus }: Props) => {
  const colorYellow = 'rgba(186, 145, 0, 1)';
  const colorYellowBg = 'rgba(186, 145, 0, 0.1)';
  const colorGreen = 'rgba(68, 148, 100, 1)';
  const colorGreenBg = 'rgba(68, 148, 100, 0.1)';
  const colorBlue = 'rgba(0, 0, 255, 1)';
  const colorBlueBg = 'rgba(0, 0, 255, 0.1)';
  const iconColor = (transactionStatus: TransactionStatus) => {
    if (transactionStatus === 'Pending')
      return `${colorYellow} ${colorYellowBg}`;
    if (transactionStatus === 'Available')
      return `${colorGreen} ${colorGreenBg}`;
    if (transactionStatus === 'Claimed') return `${colorBlue} ${colorBlueBg}`;
  };

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.5 8.5V10C9.5 10.3978 9.34196 10.7794 9.06066 11.0607C8.77936 11.342 8.39782 11.5 8 11.5H2C1.60218 11.5 1.22064 11.342 0.93934 11.0607C0.658035 10.7794 0.5 10.3978 0.5 10V4C0.5 3.60218 0.658035 3.22064 0.93934 2.93934C1.22064 2.65804 1.60218 2.5 2 2.5H3.5"
        stroke={iconColor(transactionStatus)}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.5 0.5H11.5V5.5"
        stroke={iconColor(transactionStatus)}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.5 0.5L5.5 6.5"
        stroke={iconColor(transactionStatus)}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default IconExternal;
