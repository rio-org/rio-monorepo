import React from 'react';

type Props = {
  direction: 'left' | 'right' | 'external';
};

const IconLineArrow = ({ direction = 'right' }: Props) => {
  const rotation = (direction: string) => {
    switch (direction) {
      case 'left':
        return 180;
      case 'right':
        return 0;
      case 'external':
        return -45;
      default:
        return 0;
    }
  };

  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform={`rotate(${rotation(direction)})`}
    >
      <path
        d="M54.6647 95.6687L45.9184 87.0197L76.2877 56.6511H0V44.0177H76.2877L45.9184 13.6976L54.6647 5L100 50.3344L54.6647 95.6687Z"
        fill="black"
      />
    </svg>
  );
};

export default IconLineArrow;
